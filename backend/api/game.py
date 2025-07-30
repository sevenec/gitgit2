from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from datetime import datetime, timedelta
import uuid

from models.game import GameConfig, AdInteraction, Analytics, Event
from models.user import Purchase
from database import get_database

router = APIRouter(prefix="/game", tags=["game"])

@router.get("/config", response_model=GameConfig)
async def get_game_config(db=Depends(get_database)):
    """Get current game configuration"""
    config = await db.game_config.find_one({"version": "1.0.0"})
    
    if not config:
        # Create default config
        default_config = GameConfig()
        await db.game_config.insert_one(default_config.dict())
        return default_config
    
    return GameConfig(**config)

@router.get("/events", response_model=List[Event])
async def get_active_events(db=Depends(get_database)):
    """Get currently active events"""
    now = datetime.utcnow()
    
    events = await db.events.find({
        "active": True,
        "start_date": {"$lte": now},
        "end_date": {"$gte": now}
    }).to_list(100)
    
    return [Event(**event) for event in events]

@router.post("/analytics")
async def track_event(analytics_data: Analytics, db=Depends(get_database)):
    """Track analytics event"""
    await db.analytics.insert_one(analytics_data.dict())
    return {"success": True}

@router.post("/ad/rewarded")
async def watch_rewarded_ad(user_id: str, ad_type: str = "extra_life", db=Depends(get_database)):
    """Process rewarded ad interaction"""
    
    # Get user
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check cooldown
    last_ad = user.get("last_rewarded_ad")
    if last_ad:
        cooldown_minutes = 5  # From game config
        if datetime.utcnow() - last_ad < timedelta(minutes=cooldown_minutes):
            raise HTTPException(status_code=429, detail="Ad cooldown active")
    
    # Check daily limit
    today = datetime.utcnow().date()
    daily_ads = await db.ads.count_documents({
        "user_id": user_id,
        "ad_type": "rewarded",
        "timestamp": {
            "$gte": datetime.combine(today, datetime.min.time()),
            "$lt": datetime.combine(today + timedelta(days=1), datetime.min.time())
        }
    })
    
    if daily_ads >= 10:  # Max per day
        raise HTTPException(status_code=429, detail="Daily ad limit reached")
    
    # Process reward
    reward_amount = 25 if ad_type == "coins" else 1  # 1 extra life or 25 coins
    
    # Record ad interaction
    ad_interaction = AdInteraction(
        user_id=user_id,
        ad_type="rewarded",
        ad_network="admob",
        reward_given=True,
        reward_type=ad_type,
        reward_amount=reward_amount
    )
    
    await db.ads.insert_one(ad_interaction.dict())
    
    # Update user
    update_data = {
        "last_rewarded_ad": datetime.utcnow(),
        "$inc": {"ad_interactions": 1}
    }
    
    if ad_type == "coins":
        update_data["$inc"]["cosmic_coins"] = reward_amount
    
    await db.users.update_one({"user_id": user_id}, update_data)
    
    return {
        "success": True,
        "reward_type": ad_type,
        "reward_amount": reward_amount
    }

@router.post("/purchase/verify")
async def verify_purchase(purchase_data: Purchase, db=Depends(get_database)):
    """Verify and process in-app purchase"""
    
    # In production, verify with Google Play/App Store
    # For now, we'll assume all purchases are valid
    
    user = await db.users.find_one({"user_id": purchase_data.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Process purchase based on item type
    if purchase_data.item_type == "flutterer":
        # Unlock flutterer
        await unlock_flutterer_purchase(purchase_data.user_id, purchase_data.item_id, db)
    
    elif purchase_data.item_type == "starter_pack":
        # Process starter pack
        await process_starter_pack(purchase_data.user_id, db)
    
    elif purchase_data.item_type == "coins":
        # Add coins
        coin_amounts = {"small": 500, "medium": 1200, "large": 2500}
        coins = coin_amounts.get(purchase_data.item_id, 500)
        
        await db.users.update_one(
            {"user_id": purchase_data.user_id},
            {"$inc": {"cosmic_coins": coins}}
        )
    
    # Save purchase record
    await db.purchases.insert_one(purchase_data.dict())
    
    return {"success": True, "purchase_id": purchase_data.purchase_id}

@router.post("/share-score")
async def share_score(user_id: str, score: int, platform: str, db=Depends(get_database)):
    """Process score sharing for social features"""
    
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Award coins for sharing
    share_reward = 15
    
    await db.users.update_one(
        {"user_id": user_id},
        {
            "$inc": {"cosmic_coins": share_reward},
            "$push": {"shared_scores": {
                "score": score,
                "platform": platform,
                "timestamp": datetime.utcnow()
            }}
        }
    )
    
    return {
        "success": True,
        "coins_awarded": share_reward
    }

@router.get("/flutterers")
async def get_flutterer_catalog():
    """Get all available flutterers with pricing"""
    # This would typically come from database, but for now return static data
    from ..data.flutterers import FLUTTERERS, RARITY_PRICES, STARTER_PACK
    
    return {
        "flutterers": FLUTTERERS,
        "pricing": RARITY_PRICES,
        "starter_pack": STARTER_PACK
    }

async def unlock_flutterer_purchase(user_id: str, flutterer_id: str, db):
    """Unlock flutterer via purchase"""
    await db.users.update_one(
        {"user_id": user_id},
        {
            "$set": {
                f"flutterer_progress.{flutterer_id}": {
                    "flutterer_id": flutterer_id,
                    "unlocked": True,
                    "purchase_date": datetime.utcnow(),
                    "usage_count": 0
                }
            }
        }
    )

async def process_starter_pack(user_id: str, db):
    """Process starter pack purchase"""
    # Unlock Epic Blaster Wing
    await unlock_flutterer_purchase(user_id, "epic_blaster_wing", db)
    
    # Add 1000 coins
    await db.users.update_one(
        {"user_id": user_id},
        {"$inc": {"cosmic_coins": 1000}}
    )
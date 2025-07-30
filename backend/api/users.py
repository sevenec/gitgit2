from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from models.user import User, UserCreate, UserUpdate, ScoreSubmission, LeaderboardEntry
from database import get_database

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/register", response_model=User)
async def register_user(user_data: UserCreate, db=Depends(get_database)):
    """Register a new user"""
    
    # Check if device_id already exists
    existing_user = await db.users.find_one({"device_id": user_data.device_id})
    if existing_user:
        # Return existing user for device
        return User(**existing_user)
    
    # Create new user with starter flutterer unlocked
    user = User(
        username=user_data.username,
        device_id=user_data.device_id,
        platform=user_data.platform,
        email=user_data.email,
        flutterer_progress={"basic_cosmic": {"flutterer_id": "basic_cosmic", "unlocked": True}}
    )
    
    # Insert user into database
    result = await db.users.insert_one(user.dict())
    user.user_id = str(result.inserted_id)
    
    return user

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str, db=Depends(get_database)):
    """Get user by ID"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: str, user_update: UserUpdate, db=Depends(get_database)):
    """Update user profile"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    update_data["last_active"] = datetime.utcnow()
    
    await db.users.update_one({"user_id": user_id}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"user_id": user_id})
    return User(**updated_user)

@router.post("/{user_id}/score", response_model=dict)
async def submit_score(user_id: str, score_data: ScoreSubmission, db=Depends(get_database)):
    """Submit a game score"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_obj = User(**user)
    
    # Update user stats
    coins_awarded = 0
    new_record = False
    
    if score_data.score > user_obj.game_stats.high_score:
        user_obj.game_stats.high_score = score_data.score
        coins_awarded += 50  # High score bonus
        new_record = True
    
    if score_data.level > user_obj.game_stats.max_level:
        user_obj.game_stats.max_level = score_data.level
        coins_awarded += score_data.level * 10  # Level progression bonus
    
    # Update cumulative stats
    user_obj.game_stats.enemies_defeated += score_data.enemies_defeated
    user_obj.game_stats.total_survival_time += score_data.survival_time
    user_obj.game_stats.games_played += 1
    
    # Base coin reward
    coins_awarded += int(score_data.score * 0.01) + 10
    user_obj.cosmic_coins += coins_awarded
    
    # Update last active
    user_obj.last_active = datetime.utcnow()
    
    # Save to database
    await db.users.update_one(
        {"user_id": user_id}, 
        {"$set": user_obj.dict()}
    )
    
    # Save score to leaderboard
    leaderboard_entry = {
        "user_id": user_id,
        "username": user_obj.username,
        "score": score_data.score,
        "level": score_data.level,
        "flutterer_used": score_data.flutterer_used,
        "timestamp": score_data.timestamp,
        "session_id": score_data.session_id
    }
    await db.leaderboard.insert_one(leaderboard_entry)
    
    return {
        "success": True,
        "coins_awarded": coins_awarded,
        "new_record": new_record,
        "total_coins": user_obj.cosmic_coins,
        "rank": await get_user_rank(user_id, db)
    }

@router.get("/{user_id}/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(user_id: str, limit: int = 50, db=Depends(get_database)):
    """Get global leaderboard"""
    
    # Aggregate leaderboard with ranking
    pipeline = [
        {"$group": {
            "_id": "$user_id",
            "username": {"$first": "$username"},
            "score": {"$max": "$score"},
            "level": {"$max": "$level"},
            "flutterer_used": {"$last": "$flutterer_used"},
            "timestamp": {"$last": "$timestamp"}
        }},
        {"$sort": {"score": -1}},
        {"$limit": limit},
        {"$addFields": {"user_id": "$_id"}},
        {"$project": {"_id": 0}}
    ]
    
    leaderboard = await db.leaderboard.aggregate(pipeline).to_list(limit)
    
    # Add ranking
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1
    
    return [LeaderboardEntry(**entry) for entry in leaderboard]

@router.post("/{user_id}/flutterer/unlock")
async def unlock_flutterer(user_id: str, flutterer_id: str, db=Depends(get_database)):
    """Unlock a flutterer for user"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_obj = User(**user)
    
    # Add flutterer to progress
    user_obj.flutterer_progress[flutterer_id] = {
        "flutterer_id": flutterer_id,
        "unlocked": True,
        "usage_count": 0
    }
    
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"flutterer_progress": user_obj.flutterer_progress}}
    )
    
    return {"success": True, "flutterer_id": flutterer_id}

@router.get("/{user_id}/daily-challenges")
async def get_daily_challenges(user_id: str, db=Depends(get_database)):
    """Get user's daily challenges"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_obj = User(**user)
    
    # Generate new daily challenges if needed
    today = datetime.utcnow().date()
    
    # Check if challenges are from today
    current_challenges = [c for c in user_obj.daily_challenges 
                         if c.get('created_date', datetime.min).date() == today]
    
    if not current_challenges:
        # Generate new challenges
        new_challenges = await generate_daily_challenges(user_id, db)
        user_obj.daily_challenges = new_challenges
        
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"daily_challenges": [c.dict() for c in new_challenges]}}
        )
    
    return user_obj.daily_challenges

async def get_user_rank(user_id: str, db) -> int:
    """Get user's rank on leaderboard"""
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        return 0
    
    user_score = user.get("game_stats", {}).get("high_score", 0)
    
    # Count users with higher scores
    higher_scores = await db.users.count_documents({
        "game_stats.high_score": {"$gt": user_score}
    })
    
    return higher_scores + 1

async def generate_daily_challenges(user_id: str, db):
    """Generate daily challenges for user"""
    from models.game import DailyChallengeTemplate
    from models.user import DailyChallenge
    
    # Sample challenge templates
    templates = [
        {"name": "Score Master", "type": "score", "target": 5000, "reward": 100},
        {"name": "Survivor", "type": "survival", "target": 120, "reward": 75},
        {"name": "Level Climber", "type": "level", "target": 10, "reward": 125},
        {"name": "Enemy Hunter", "type": "enemies", "target": 50, "reward": 80}
    ]
    
    # Generate 3 random challenges
    import random
    selected = random.sample(templates, 3)
    
    challenges = []
    for template in selected:
        challenge = DailyChallenge(
            challenge_id=str(uuid.uuid4()),
            challenge_type=template["type"],
            target_value=template["target"],
            reward_coins=template["reward"],
            completed=False
        )
        challenges.append(challenge)
    
    return challenges
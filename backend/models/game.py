from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
import uuid

class FluttererSkin(BaseModel):
    skin_id: str
    flutterer_id: str
    name: str
    rarity: str
    price_usd: float
    colors: Dict[str, str]
    special_effects: List[str] = []
    unlock_condition: Optional[str] = None

class DailyChallengeTemplate(BaseModel):
    challenge_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    challenge_type: str
    target_value: int
    reward_coins: int
    difficulty: str  # 'easy', 'medium', 'hard'
    active: bool = True

class Event(BaseModel):
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    event_type: str  # 'score_boost', 'double_coins', 'special_flutterer'
    start_date: datetime
    end_date: datetime
    rewards: Dict[str, int]  # {'coins': 500, 'flutterer': 'legendary_flutter'}
    active: bool = True

class GameConfig(BaseModel):
    version: str = "1.0.0"
    maintenance_mode: bool = False
    min_app_version: str = "1.0.0"
    force_update: bool = False
    
    # Monetization settings
    ad_cooldown_minutes: int = 5
    max_rewarded_ads_per_day: int = 10
    coin_ad_reward: int = 25
    
    # Game balance
    base_coin_reward: int = 10
    score_multiplier: float = 0.1
    level_completion_bonus: int = 50
    boss_defeat_bonus: int = 200
    
    # Social features
    max_friends: int = 50
    share_score_coin_reward: int = 15
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AdInteraction(BaseModel):
    interaction_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    ad_type: str  # 'rewarded', 'interstitial', 'banner'
    ad_network: str  # 'admob', 'unity_ads'
    reward_given: bool = False
    reward_type: Optional[str] = None  # 'coins', 'extra_life'
    reward_amount: int = 0
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Analytics(BaseModel):
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    event_type: str
    event_data: Dict
    session_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    platform: str
    app_version: str
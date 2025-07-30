from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class FluttererProgress(BaseModel):
    flutterer_id: str
    unlocked: bool = False
    purchase_date: Optional[datetime] = None
    usage_count: int = 0

class GameStats(BaseModel):
    high_score: int = 0
    max_level: int = 1
    enemies_defeated: int = 0
    total_survival_time: int = 0  # in seconds
    boss_defeats: int = 0
    games_played: int = 0
    total_playtime: int = 0  # in seconds
    achievements: List[str] = []

class SharedScore(BaseModel):
    score: int
    platform: str
    timestamp: datetime

class DailyChallenge(BaseModel):
    challenge_id: str
    challenge_type: str  # 'score', 'survival', 'level', 'enemies'
    target_value: int
    reward_coins: int
    completed: bool = False
    completion_date: Optional[datetime] = None

class Purchase(BaseModel):
    purchase_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    item_type: str  # 'flutterer', 'skin', 'starter_pack', 'coins'
    item_id: str
    price_usd: float
    currency: str = 'USD'
    platform: str  # 'android', 'ios', 'web'
    transaction_id: Optional[str] = None
    purchase_date: datetime = Field(default_factory=datetime.utcnow)
    verified: bool = False

class User(BaseModel):
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: Optional[str] = None
    device_id: str
    platform: str  # 'android', 'ios', 'web'
    
    # Game Progress
    cosmic_coins: int = 0
    selected_flutterer: str = 'basic_cosmic'
    flutterer_progress: Dict[str, FluttererProgress] = {}
    game_stats: GameStats = Field(default_factory=GameStats)
    
    # Social Features
    daily_challenges: List[DailyChallenge] = []
    friends: List[str] = []
    shared_scores: List[str] = []
    
    # Monetization
    purchases: List[Purchase] = []
    ad_interactions: int = 0
    last_rewarded_ad: Optional[datetime] = None
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: datetime = Field(default_factory=datetime.utcnow)
    app_version: str = "1.0.0"
    total_sessions: int = 0

class UserCreate(BaseModel):
    username: str
    device_id: str
    platform: str
    email: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    selected_flutterer: Optional[str] = None

class ScoreSubmission(BaseModel):
    user_id: str
    score: int
    level: int
    survival_time: int
    enemies_defeated: int
    flutterer_used: str
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class LeaderboardEntry(BaseModel):
    user_id: str
    username: str
    score: int
    level: int
    flutterer_used: str
    timestamp: datetime
    rank: int
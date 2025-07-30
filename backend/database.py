from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

db = Database()

async def get_database():
    return db.database

async def connect_to_mongo():
    """Create database connection"""
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'butterfly_nebula')
    
    db.client = AsyncIOMotorClient(mongo_url)
    db.database = db.client[db_name]
    
    # Create indexes for better performance
    await create_indexes()

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()

async def create_indexes():
    """Create database indexes for optimal performance"""
    if db.database is None:
        return
    
    # User indexes
    await db.database.users.create_index("user_id", unique=True)
    await db.database.users.create_index("device_id", unique=True)
    await db.database.users.create_index("email")
    await db.database.users.create_index("last_active")
    await db.database.users.create_index("game_stats.high_score")
    
    # Leaderboard indexes
    await db.database.leaderboard.create_index([("score", -1), ("timestamp", -1)])
    await db.database.leaderboard.create_index("user_id")
    await db.database.leaderboard.create_index("session_id")
    
    # Purchase indexes
    await db.database.purchases.create_index("user_id")
    await db.database.purchases.create_index("purchase_date")
    await db.database.purchases.create_index("transaction_id")
    
    # Analytics indexes
    await db.database.analytics.create_index([("timestamp", -1)])
    await db.database.analytics.create_index("user_id")
    await db.database.analytics.create_index("event_type")
    
    # Ad interaction indexes
    await db.database.ads.create_index("user_id")
    await db.database.ads.create_index("timestamp")
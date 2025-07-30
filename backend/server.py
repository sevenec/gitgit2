from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from pathlib import Path

# Import database connection
from .database import connect_to_mongo, close_mongo_connection

# Import API routers
from .api.users import router as users_router
from .api.game import router as game_router

ROOT_DIR = Path(__file__).parent
from dotenv import load_dotenv
load_dotenv(ROOT_DIR / '.env')

# Lifespan manager for database connections
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

# Create the main app
app = FastAPI(
    title="Butterfly Nebula Brawl API",
    description="Backend API for the mobile game Butterfly Nebula Brawl",
    version="1.0.0",
    lifespan=lifespan
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Original hello world endpoint
@api_router.get("/")
async def root():
    return {"message": "Butterfly Nebula Brawl API v1.0.0"}

# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": "2025-01-30T01:00:00Z"
    }

# Include feature routers
api_router.include_router(users_router)
api_router.include_router(game_router)

# Include the main API router
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
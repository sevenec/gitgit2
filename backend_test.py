#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Butterfly Nebula Brawl
Tests all backend endpoints including user management, game features, and monetization
"""

import requests
import json
import uuid
from datetime import datetime
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

class ButterflyNebulaAPITester:
    def __init__(self):
        self.base_url = API_BASE
        self.test_user_id = None
        self.test_device_id = f"test_device_{uuid.uuid4().hex[:8]}"
        self.test_username = f"CosmicPlayer_{uuid.uuid4().hex[:6]}"
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'ButterflyNebula-Test/1.0'
        })
        
    def log_test(self, test_name, status, details=""):
        """Log test results"""
        status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_symbol} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
        print()
    
    def test_health_endpoints(self):
        """Test basic health and connectivity endpoints"""
        print("=== Testing Health & Basic Connectivity ===")
        
        # Test health endpoint
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log_test("Health Check", "PASS", f"Status: {data.get('status')}, Version: {data.get('version')}")
                else:
                    self.log_test("Health Check", "FAIL", f"Invalid response: {data}")
            else:
                self.log_test("Health Check", "FAIL", f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Health Check", "FAIL", f"Exception: {str(e)}")
        
        # Test root endpoint
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Butterfly Nebula Brawl" in data["message"]:
                    self.log_test("Root Endpoint", "PASS", f"Message: {data.get('message')}")
                else:
                    self.log_test("Root Endpoint", "FAIL", f"Invalid response: {data}")
            else:
                self.log_test("Root Endpoint", "FAIL", f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Root Endpoint", "FAIL", f"Exception: {str(e)}")
    
    def test_user_registration(self):
        """Test user registration endpoint"""
        print("=== Testing User Registration ===")
        
        user_data = {
            "username": self.test_username,
            "device_id": self.test_device_id,
            "platform": "android",
            "email": f"test_{uuid.uuid4().hex[:6]}@cosmicgames.com"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/users/register", json=user_data)
            if response.status_code == 200:
                data = response.json()
                if "user_id" in data and "username" in data:
                    self.test_user_id = data["user_id"]
                    self.log_test("User Registration", "PASS", 
                                f"User ID: {self.test_user_id}, Username: {data.get('username')}")
                    
                    # Verify starter flutterer is unlocked
                    if "flutterer_progress" in data and "basic_cosmic" in data["flutterer_progress"]:
                        self.log_test("Starter Flutterer Unlock", "PASS", "Basic Cosmic Flutter unlocked")
                    else:
                        self.log_test("Starter Flutterer Unlock", "FAIL", "Starter flutterer not unlocked")
                else:
                    self.log_test("User Registration", "FAIL", f"Invalid response: {data}")
            else:
                self.log_test("User Registration", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("User Registration", "FAIL", f"Exception: {str(e)}")
    
    def test_get_user(self):
        """Test get user endpoint"""
        print("=== Testing Get User ===")
        
        if not self.test_user_id:
            self.log_test("Get User", "SKIP", "No user ID available")
            return
        
        try:
            response = self.session.get(f"{self.base_url}/users/{self.test_user_id}")
            if response.status_code == 200:
                data = response.json()
                if data.get("user_id") == self.test_user_id:
                    self.log_test("Get User", "PASS", 
                                f"Retrieved user: {data.get('username')}, Coins: {data.get('cosmic_coins', 0)}")
                else:
                    self.log_test("Get User", "FAIL", f"User ID mismatch: {data}")
            else:
                self.log_test("Get User", "FAIL", f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Get User", "FAIL", f"Exception: {str(e)}")
    
    def test_score_submission(self):
        """Test score submission endpoint"""
        print("=== Testing Score Submission ===")
        
        if not self.test_user_id:
            self.log_test("Score Submission", "SKIP", "No user ID available")
            return
        
        score_data = {
            "user_id": self.test_user_id,
            "score": 15750,
            "level": 8,
            "survival_time": 245,
            "enemies_defeated": 42,
            "flutterer_used": "basic_cosmic",
            "session_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        try:
            response = self.session.post(f"{self.base_url}/users/{self.test_user_id}/score", json=score_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "coins_awarded" in data:
                    self.log_test("Score Submission", "PASS", 
                                f"Coins awarded: {data.get('coins_awarded')}, New record: {data.get('new_record')}")
                else:
                    self.log_test("Score Submission", "FAIL", f"Invalid response: {data}")
            else:
                self.log_test("Score Submission", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Score Submission", "FAIL", f"Exception: {str(e)}")
    
    def test_leaderboard(self):
        """Test leaderboard endpoint"""
        print("=== Testing Leaderboard ===")
        
        if not self.test_user_id:
            self.log_test("Leaderboard", "SKIP", "No user ID available")
            return
        
        try:
            response = self.session.get(f"{self.base_url}/users/{self.test_user_id}/leaderboard?limit=10")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Leaderboard", "PASS", f"Retrieved {len(data)} leaderboard entries")
                    
                    # Check if our user appears in leaderboard
                    user_found = any(entry.get("user_id") == self.test_user_id for entry in data)
                    if user_found:
                        self.log_test("User in Leaderboard", "PASS", "Test user found in leaderboard")
                    else:
                        self.log_test("User in Leaderboard", "INFO", "Test user not yet in leaderboard (may be normal)")
                else:
                    self.log_test("Leaderboard", "FAIL", f"Invalid response format: {data}")
            else:
                self.log_test("Leaderboard", "FAIL", f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Leaderboard", "FAIL", f"Exception: {str(e)}")
    
    def test_game_config(self):
        """Test game configuration endpoint"""
        print("=== Testing Game Configuration ===")
        
        try:
            response = self.session.get(f"{self.base_url}/game/config")
            if response.status_code == 200:
                data = response.json()
                required_fields = ["version", "maintenance_mode", "ad_cooldown_minutes", "max_rewarded_ads_per_day"]
                if all(field in data for field in required_fields):
                    self.log_test("Game Config", "PASS", 
                                f"Version: {data.get('version')}, Maintenance: {data.get('maintenance_mode')}")
                else:
                    self.log_test("Game Config", "FAIL", f"Missing required fields: {data}")
            else:
                self.log_test("Game Config", "FAIL", f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Game Config", "FAIL", f"Exception: {str(e)}")
    
    def test_flutterer_catalog(self):
        """Test flutterer catalog endpoint"""
        print("=== Testing Flutterer Catalog ===")
        
        try:
            response = self.session.get(f"{self.base_url}/game/flutterers")
            if response.status_code == 200:
                data = response.json()
                if "flutterers" in data and "pricing" in data:
                    flutterers = data["flutterers"]
                    if isinstance(flutterers, list) and len(flutterers) > 0:
                        self.log_test("Flutterer Catalog", "PASS", 
                                    f"Retrieved {len(flutterers)} flutterers")
                        
                        # Check for starter flutterer
                        starter_found = any(f.get("id") == "basic_cosmic" for f in flutterers)
                        if starter_found:
                            self.log_test("Starter Flutterer in Catalog", "PASS", "Basic Cosmic Flutter found")
                        else:
                            self.log_test("Starter Flutterer in Catalog", "FAIL", "Basic Cosmic Flutter not found")
                    else:
                        self.log_test("Flutterer Catalog", "FAIL", "Empty or invalid flutterers list")
                else:
                    self.log_test("Flutterer Catalog", "FAIL", f"Missing required fields: {data}")
            else:
                self.log_test("Flutterer Catalog", "FAIL", f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Flutterer Catalog", "FAIL", f"Exception: {str(e)}")
    
    def test_active_events(self):
        """Test active events endpoint"""
        print("=== Testing Active Events ===")
        
        try:
            response = self.session.get(f"{self.base_url}/game/events")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Active Events", "PASS", f"Retrieved {len(data)} active events")
                else:
                    self.log_test("Active Events", "FAIL", f"Invalid response format: {data}")
            else:
                self.log_test("Active Events", "FAIL", f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Active Events", "FAIL", f"Exception: {str(e)}")
    
    def test_rewarded_ad(self):
        """Test rewarded ad endpoint"""
        print("=== Testing Rewarded Ad ===")
        
        if not self.test_user_id:
            self.log_test("Rewarded Ad", "SKIP", "No user ID available")
            return
        
        try:
            # Test coin reward ad
            response = self.session.post(f"{self.base_url}/game/ad/rewarded?user_id={self.test_user_id}&ad_type=coins")
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "reward_amount" in data:
                    self.log_test("Rewarded Ad (Coins)", "PASS", 
                                f"Reward: {data.get('reward_amount')} {data.get('reward_type')}")
                else:
                    self.log_test("Rewarded Ad (Coins)", "FAIL", f"Invalid response: {data}")
            else:
                self.log_test("Rewarded Ad (Coins)", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Rewarded Ad (Coins)", "FAIL", f"Exception: {str(e)}")
        
        # Test extra life ad (after a short delay to avoid cooldown)
        time.sleep(1)
        try:
            response = self.session.post(f"{self.base_url}/game/ad/rewarded?user_id={self.test_user_id}&ad_type=extra_life")
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Rewarded Ad (Extra Life)", "PASS", 
                                f"Reward: {data.get('reward_amount')} {data.get('reward_type')}")
                else:
                    self.log_test("Rewarded Ad (Extra Life)", "FAIL", f"Invalid response: {data}")
            elif response.status_code == 429:
                self.log_test("Rewarded Ad (Extra Life)", "INFO", "Cooldown active (expected behavior)")
            else:
                self.log_test("Rewarded Ad (Extra Life)", "FAIL", f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Rewarded Ad (Extra Life)", "FAIL", f"Exception: {str(e)}")
    
    def test_share_score(self):
        """Test social sharing endpoint"""
        print("=== Testing Social Sharing ===")
        
        if not self.test_user_id:
            self.log_test("Share Score", "SKIP", "No user ID available")
            return
        
        share_data = {
            "user_id": self.test_user_id,
            "score": 15750,
            "platform": "twitter"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/game/share-score", params=share_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "coins_awarded" in data:
                    self.log_test("Share Score", "PASS", f"Coins awarded: {data.get('coins_awarded')}")
                else:
                    self.log_test("Share Score", "FAIL", f"Invalid response: {data}")
            else:
                self.log_test("Share Score", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Share Score", "FAIL", f"Exception: {str(e)}")
    
    def test_flutterer_unlock(self):
        """Test flutterer unlock endpoint"""
        print("=== Testing Flutterer Unlock ===")
        
        if not self.test_user_id:
            self.log_test("Flutterer Unlock", "SKIP", "No user ID available")
            return
        
        try:
            response = self.session.post(f"{self.base_url}/users/{self.test_user_id}/flutterer/unlock?flutterer_id=stardust_dancer")
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("flutterer_id") == "stardust_dancer":
                    self.log_test("Flutterer Unlock", "PASS", f"Unlocked: {data.get('flutterer_id')}")
                else:
                    self.log_test("Flutterer Unlock", "FAIL", f"Invalid response: {data}")
            else:
                self.log_test("Flutterer Unlock", "FAIL", f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Flutterer Unlock", "FAIL", f"Exception: {str(e)}")
    
    def test_daily_challenges(self):
        """Test daily challenges endpoint"""
        print("=== Testing Daily Challenges ===")
        
        if not self.test_user_id:
            self.log_test("Daily Challenges", "SKIP", "No user ID available")
            return
        
        try:
            response = self.session.get(f"{self.base_url}/users/{self.test_user_id}/daily-challenges")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Daily Challenges", "PASS", f"Retrieved {len(data)} daily challenges")
                else:
                    self.log_test("Daily Challenges", "FAIL", f"Invalid response format: {data}")
            else:
                self.log_test("Daily Challenges", "FAIL", f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Daily Challenges", "FAIL", f"Exception: {str(e)}")
    
    def test_database_persistence(self):
        """Test that data persists correctly"""
        print("=== Testing Database Persistence ===")
        
        if not self.test_user_id:
            self.log_test("Database Persistence", "SKIP", "No user ID available")
            return
        
        # Get user data again to verify persistence
        try:
            response = self.session.get(f"{self.base_url}/users/{self.test_user_id}")
            if response.status_code == 200:
                data = response.json()
                
                # Check if user has coins from previous tests
                if data.get("cosmic_coins", 0) > 0:
                    self.log_test("Coin Persistence", "PASS", f"User has {data.get('cosmic_coins')} coins")
                else:
                    self.log_test("Coin Persistence", "INFO", "User has no coins (may be normal)")
                
                # Check if game stats were updated
                game_stats = data.get("game_stats", {})
                if game_stats.get("games_played", 0) > 0:
                    self.log_test("Game Stats Persistence", "PASS", 
                                f"Games played: {game_stats.get('games_played')}, High score: {game_stats.get('high_score')}")
                else:
                    self.log_test("Game Stats Persistence", "INFO", "No game stats recorded")
                
                # Check flutterer progress
                flutterer_progress = data.get("flutterer_progress", {})
                if len(flutterer_progress) > 1:  # More than just the starter
                    self.log_test("Flutterer Progress Persistence", "PASS", 
                                f"User has {len(flutterer_progress)} flutterers")
                else:
                    self.log_test("Flutterer Progress Persistence", "INFO", "Only starter flutterer unlocked")
                    
            else:
                self.log_test("Database Persistence", "FAIL", f"Could not retrieve user data: {response.status_code}")
        except Exception as e:
            self.log_test("Database Persistence", "FAIL", f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Butterfly Nebula Brawl Backend API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Run tests in logical order
        self.test_health_endpoints()
        self.test_user_registration()
        self.test_get_user()
        self.test_score_submission()
        self.test_leaderboard()
        self.test_game_config()
        self.test_flutterer_catalog()
        self.test_active_events()
        self.test_rewarded_ad()
        self.test_share_score()
        self.test_flutterer_unlock()
        self.test_daily_challenges()
        self.test_database_persistence()
        
        print("=" * 60)
        print("🏁 Backend API Testing Complete!")
        print(f"Test User ID: {self.test_user_id}")
        print(f"Test Device ID: {self.test_device_id}")

if __name__ == "__main__":
    tester = ButterflyNebulaAPITester()
    tester.run_all_tests()
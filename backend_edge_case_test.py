#!/usr/bin/env python3
"""
Edge Case and Error Handling Test Suite for Butterfly Nebula Brawl Backend
Tests error conditions, validation, and edge cases
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

class EdgeCaseAPITester:
    def __init__(self):
        self.base_url = API_BASE
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'ButterflyNebula-EdgeTest/1.0'
        })
        
    def log_test(self, test_name, status, details=""):
        """Log test results"""
        status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_symbol} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
        print()
    
    def test_invalid_endpoints(self):
        """Test invalid endpoints return proper 404s"""
        print("=== Testing Invalid Endpoints ===")
        
        invalid_endpoints = [
            "/api/invalid",
            "/api/users/invalid/action",
            "/api/game/invalid",
            "/api/nonexistent"
        ]
        
        for endpoint in invalid_endpoints:
            try:
                response = self.session.get(f"{BACKEND_URL}{endpoint}")
                if response.status_code == 404:
                    self.log_test(f"Invalid Endpoint {endpoint}", "PASS", "Returns 404 as expected")
                else:
                    self.log_test(f"Invalid Endpoint {endpoint}", "FAIL", f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"Invalid Endpoint {endpoint}", "FAIL", f"Exception: {str(e)}")
    
    def test_user_not_found_scenarios(self):
        """Test user not found scenarios"""
        print("=== Testing User Not Found Scenarios ===")
        
        fake_user_id = "nonexistent_user_12345"
        
        # Test get user with invalid ID
        try:
            response = self.session.get(f"{self.base_url}/users/{fake_user_id}")
            if response.status_code == 404:
                self.log_test("Get Invalid User", "PASS", "Returns 404 for non-existent user")
            else:
                self.log_test("Get Invalid User", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Get Invalid User", "FAIL", f"Exception: {str(e)}")
        
        # Test score submission with invalid user
        try:
            score_data = {
                "user_id": fake_user_id,
                "score": 1000,
                "level": 1,
                "survival_time": 60,
                "enemies_defeated": 10,
                "flutterer_used": "basic_cosmic",
                "session_id": str(uuid.uuid4()),
                "timestamp": datetime.utcnow().isoformat()
            }
            response = self.session.post(f"{self.base_url}/users/{fake_user_id}/score", json=score_data)
            if response.status_code == 404:
                self.log_test("Score Submit Invalid User", "PASS", "Returns 404 for non-existent user")
            else:
                self.log_test("Score Submit Invalid User", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Score Submit Invalid User", "FAIL", f"Exception: {str(e)}")
    
    def test_malformed_requests(self):
        """Test malformed request handling"""
        print("=== Testing Malformed Requests ===")
        
        # Test user registration with missing fields
        try:
            incomplete_data = {"username": "test"}  # Missing required fields
            response = self.session.post(f"{self.base_url}/users/register", json=incomplete_data)
            if response.status_code in [400, 422]:  # Bad request or validation error
                self.log_test("Incomplete Registration", "PASS", f"Returns {response.status_code} for incomplete data")
            else:
                self.log_test("Incomplete Registration", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Incomplete Registration", "FAIL", f"Exception: {str(e)}")
        
        # Test score submission with invalid data types
        try:
            invalid_score_data = {
                "user_id": "test_user",
                "score": "invalid_score",  # Should be integer
                "level": "invalid_level",  # Should be integer
                "survival_time": "invalid_time",  # Should be integer
                "enemies_defeated": "invalid_count",  # Should be integer
                "flutterer_used": "basic_cosmic",
                "session_id": str(uuid.uuid4()),
                "timestamp": datetime.utcnow().isoformat()
            }
            response = self.session.post(f"{self.base_url}/users/test_user/score", json=invalid_score_data)
            if response.status_code in [400, 422]:
                self.log_test("Invalid Score Data Types", "PASS", f"Returns {response.status_code} for invalid data types")
            else:
                self.log_test("Invalid Score Data Types", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Invalid Score Data Types", "FAIL", f"Exception: {str(e)}")
    
    def test_rate_limiting_and_cooldowns(self):
        """Test rate limiting and cooldown mechanisms"""
        print("=== Testing Rate Limiting & Cooldowns ===")
        
        # First, create a test user for ad testing
        user_data = {
            "username": f"RateLimitTest_{uuid.uuid4().hex[:6]}",
            "device_id": f"rate_test_{uuid.uuid4().hex[:8]}",
            "platform": "android",
            "email": f"ratetest_{uuid.uuid4().hex[:6]}@test.com"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/users/register", json=user_data)
            if response.status_code == 200:
                user_id = response.json()["user_id"]
                
                # Test rewarded ad cooldown
                # First ad should work
                response1 = self.session.post(f"{self.base_url}/game/ad/rewarded?user_id={user_id}&ad_type=coins")
                if response1.status_code == 200:
                    self.log_test("First Rewarded Ad", "PASS", "First ad request successful")
                    
                    # Second ad immediately should be blocked by cooldown
                    response2 = self.session.post(f"{self.base_url}/game/ad/rewarded?user_id={user_id}&ad_type=coins")
                    if response2.status_code == 429:
                        self.log_test("Ad Cooldown Enforcement", "PASS", "Cooldown properly enforced")
                    else:
                        self.log_test("Ad Cooldown Enforcement", "FAIL", f"Status: {response2.status_code}")
                else:
                    self.log_test("First Rewarded Ad", "FAIL", f"Status: {response1.status_code}")
            else:
                self.log_test("Rate Limit Test User Creation", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Rate Limiting Test", "FAIL", f"Exception: {str(e)}")
    
    def test_data_validation(self):
        """Test data validation and constraints"""
        print("=== Testing Data Validation ===")
        
        # Test extremely large score values
        user_data = {
            "username": f"ValidationTest_{uuid.uuid4().hex[:6]}",
            "device_id": f"validation_test_{uuid.uuid4().hex[:8]}",
            "platform": "android",
            "email": f"validation_{uuid.uuid4().hex[:6]}@test.com"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/users/register", json=user_data)
            if response.status_code == 200:
                user_id = response.json()["user_id"]
                
                # Test with extremely large score
                extreme_score_data = {
                    "user_id": user_id,
                    "score": 999999999,  # Very large score
                    "level": 1000,  # Very high level
                    "survival_time": 86400,  # 24 hours
                    "enemies_defeated": 100000,  # Many enemies
                    "flutterer_used": "basic_cosmic",
                    "session_id": str(uuid.uuid4()),
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                response = self.session.post(f"{self.base_url}/users/{user_id}/score", json=extreme_score_data)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success") and "coins_awarded" in data:
                        self.log_test("Extreme Score Values", "PASS", f"Handled extreme values, coins: {data.get('coins_awarded')}")
                    else:
                        self.log_test("Extreme Score Values", "FAIL", "Invalid response structure")
                else:
                    self.log_test("Extreme Score Values", "FAIL", f"Status: {response.status_code}")
            else:
                self.log_test("Validation Test User Creation", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Data Validation Test", "FAIL", f"Exception: {str(e)}")
    
    def test_concurrent_operations(self):
        """Test concurrent operations and race conditions"""
        print("=== Testing Concurrent Operations ===")
        
        # Create a test user
        user_data = {
            "username": f"ConcurrentTest_{uuid.uuid4().hex[:6]}",
            "device_id": f"concurrent_test_{uuid.uuid4().hex[:8]}",
            "platform": "android",
            "email": f"concurrent_{uuid.uuid4().hex[:6]}@test.com"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/users/register", json=user_data)
            if response.status_code == 200:
                user_id = response.json()["user_id"]
                
                # Test multiple score submissions rapidly
                import threading
                import time
                
                results = []
                
                def submit_score(score_value):
                    score_data = {
                        "user_id": user_id,
                        "score": score_value,
                        "level": 1,
                        "survival_time": 60,
                        "enemies_defeated": 10,
                        "flutterer_used": "basic_cosmic",
                        "session_id": str(uuid.uuid4()),
                        "timestamp": datetime.utcnow().isoformat()
                    }
                    try:
                        resp = self.session.post(f"{self.base_url}/users/{user_id}/score", json=score_data)
                        results.append(resp.status_code == 200)
                    except:
                        results.append(False)
                
                # Submit 3 scores concurrently
                threads = []
                for i in range(3):
                    thread = threading.Thread(target=submit_score, args=(1000 + i * 100,))
                    threads.append(thread)
                    thread.start()
                
                # Wait for all threads to complete
                for thread in threads:
                    thread.join()
                
                if all(results):
                    self.log_test("Concurrent Score Submissions", "PASS", f"All {len(results)} concurrent submissions successful")
                else:
                    self.log_test("Concurrent Score Submissions", "FAIL", f"Only {sum(results)}/{len(results)} submissions successful")
            else:
                self.log_test("Concurrent Test User Creation", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Concurrent Operations Test", "FAIL", f"Exception: {str(e)}")
    
    def run_all_edge_case_tests(self):
        """Run all edge case tests"""
        print("🔍 Starting Butterfly Nebula Brawl Backend Edge Case Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 70)
        
        self.test_invalid_endpoints()
        self.test_user_not_found_scenarios()
        self.test_malformed_requests()
        self.test_rate_limiting_and_cooldowns()
        self.test_data_validation()
        self.test_concurrent_operations()
        
        print("=" * 70)
        print("🏁 Backend Edge Case Testing Complete!")

if __name__ == "__main__":
    tester = EdgeCaseAPITester()
    tester.run_all_edge_case_tests()
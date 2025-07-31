#!/usr/bin/env python3
"""
Comprehensive Stress Testing and Edge Case Testing for Butterfly Nebula Brawl Backend
Tests concurrent operations, edge cases, and performance under load
"""

import requests
import json
import uuid
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
import statistics
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

class StressTester:
    def __init__(self):
        self.base_url = API_BASE
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'ButterflyNebula-StressTest/1.0'
        })
        self.results = []
        
    def log_test(self, test_name, status, details=""):
        """Log test results"""
        status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_symbol} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
        print()
    
    def measure_response_time(self, func, *args, **kwargs):
        """Measure response time for a function"""
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            end_time = time.time()
            return result, (end_time - start_time) * 1000  # Convert to milliseconds
        except Exception as e:
            end_time = time.time()
            return None, (end_time - start_time) * 1000
    
    def test_concurrent_user_registration(self, num_users=20):
        """Test concurrent user registrations"""
        print(f"=== Testing Concurrent User Registration ({num_users} users) ===")
        
        def register_user(user_num):
            user_data = {
                "username": f"StressUser_{user_num}_{uuid.uuid4().hex[:4]}",
                "device_id": f"stress_device_{user_num}_{uuid.uuid4().hex[:8]}",
                "platform": "android",
                "email": f"stress_{user_num}_{uuid.uuid4().hex[:4]}@test.com"
            }
            
            response, response_time = self.measure_response_time(
                self.session.post, f"{self.base_url}/users/register", json=user_data
            )
            
            return {
                'user_num': user_num,
                'success': response and response.status_code == 200,
                'response_time': response_time,
                'user_id': response.json().get('user_id') if response and response.status_code == 200 else None
            }
        
        # Execute concurrent registrations
        start_time = time.time()
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(register_user, i) for i in range(num_users)]
            results = [future.result() for future in as_completed(futures)]
        
        total_time = time.time() - start_time
        
        # Analyze results
        successful = [r for r in results if r['success']]
        failed = [r for r in results if not r['success']]
        response_times = [r['response_time'] for r in successful]
        
        if len(successful) == num_users:
            avg_time = statistics.mean(response_times)
            self.log_test("Concurrent User Registration", "PASS", 
                        f"{len(successful)}/{num_users} successful in {total_time:.2f}s, avg response: {avg_time:.2f}ms")
        else:
            self.log_test("Concurrent User Registration", "FAIL", 
                        f"Only {len(successful)}/{num_users} successful, {len(failed)} failed")
        
        return [r['user_id'] for r in successful if r['user_id']]
    
    def test_concurrent_score_submissions(self, user_ids, num_submissions=20):
        """Test concurrent score submissions"""
        print(f"=== Testing Concurrent Score Submissions ({num_submissions} submissions) ===")
        
        if not user_ids:
            self.log_test("Concurrent Score Submissions", "SKIP", "No user IDs available")
            return
        
        def submit_score(submission_num):
            user_id = user_ids[submission_num % len(user_ids)]
            score_data = {
                "user_id": user_id,
                "score": 10000 + (submission_num * 100),
                "level": 5 + (submission_num % 10),
                "survival_time": 120 + (submission_num * 5),
                "enemies_defeated": 20 + (submission_num * 2),
                "flutterer_used": "basic_cosmic",
                "session_id": str(uuid.uuid4()),
                "timestamp": datetime.utcnow().isoformat()
            }
            
            response, response_time = self.measure_response_time(
                self.session.post, f"{self.base_url}/users/{user_id}/score", json=score_data
            )
            
            return {
                'submission_num': submission_num,
                'success': response and response.status_code == 200,
                'response_time': response_time,
                'user_id': user_id
            }
        
        # Execute concurrent submissions
        start_time = time.time()
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(submit_score, i) for i in range(num_submissions)]
            results = [future.result() for future in as_completed(futures)]
        
        total_time = time.time() - start_time
        
        # Analyze results
        successful = [r for r in results if r['success']]
        failed = [r for r in results if not r['success']]
        response_times = [r['response_time'] for r in successful]
        
        if len(successful) >= num_submissions * 0.9:  # Allow 10% failure rate
            avg_time = statistics.mean(response_times) if response_times else 0
            self.log_test("Concurrent Score Submissions", "PASS", 
                        f"{len(successful)}/{num_submissions} successful in {total_time:.2f}s, avg response: {avg_time:.2f}ms")
        else:
            self.log_test("Concurrent Score Submissions", "FAIL", 
                        f"Only {len(successful)}/{num_submissions} successful, {len(failed)} failed")
    
    def test_performance_benchmarks(self):
        """Test performance benchmarks for key endpoints"""
        print("=== Testing Performance Benchmarks ===")
        
        endpoints = [
            ("Health Check", "GET", "/health", None),
            ("Game Config", "GET", "/game/config", None),
            ("Flutterer Catalog", "GET", "/game/flutterers", None),
            ("Active Events", "GET", "/game/events", None)
        ]
        
        for name, method, endpoint, data in endpoints:
            response_times = []
            successful_requests = 0
            
            for i in range(10):  # Test each endpoint 10 times
                if method == "GET":
                    response, response_time = self.measure_response_time(
                        self.session.get, f"{self.base_url}{endpoint}"
                    )
                else:
                    response, response_time = self.measure_response_time(
                        self.session.post, f"{self.base_url}{endpoint}", json=data
                    )
                
                if response and response.status_code == 200:
                    successful_requests += 1
                    response_times.append(response_time)
                
                time.sleep(0.1)  # Small delay between requests
            
            if successful_requests >= 8:  # Allow 2 failures out of 10
                avg_time = statistics.mean(response_times)
                p95_time = statistics.quantiles(response_times, n=20)[18] if len(response_times) >= 5 else avg_time
                self.log_test(f"Performance - {name}", "PASS", 
                            f"Avg: {avg_time:.2f}ms, 95th percentile: {p95_time:.2f}ms, Success: {successful_requests}/10")
            else:
                self.log_test(f"Performance - {name}", "FAIL", 
                            f"Only {successful_requests}/10 requests successful")
    
    def test_edge_cases(self):
        """Test edge cases and error handling"""
        print("=== Testing Edge Cases & Error Handling ===")
        
        # Test invalid endpoints
        response = self.session.get(f"{self.base_url}/invalid/endpoint")
        if response.status_code == 404:
            self.log_test("Invalid Endpoint Handling", "PASS", "Returns 404 for invalid endpoints")
        else:
            self.log_test("Invalid Endpoint Handling", "FAIL", f"Status code: {response.status_code}")
        
        # Test user not found
        fake_user_id = "000000000000000000000000"
        response = self.session.get(f"{self.base_url}/users/{fake_user_id}")
        if response.status_code in [404, 422]:
            self.log_test("User Not Found Handling", "PASS", f"Returns {response.status_code} for non-existent user")
        else:
            self.log_test("User Not Found Handling", "FAIL", f"Status code: {response.status_code}")
        
        # Test malformed registration data
        invalid_data = {"invalid": "data"}
        response = self.session.post(f"{self.base_url}/users/register", json=invalid_data)
        if response.status_code == 422:
            self.log_test("Malformed Data Handling", "PASS", "Returns 422 for invalid registration data")
        else:
            self.log_test("Malformed Data Handling", "FAIL", f"Status code: {response.status_code}")
        
        # Test extreme score values
        # First create a test user
        user_data = {
            "username": f"EdgeTestUser_{uuid.uuid4().hex[:6]}",
            "device_id": f"edge_device_{uuid.uuid4().hex[:8]}",
            "platform": "android",
            "email": f"edge_{uuid.uuid4().hex[:6]}@test.com"
        }
        
        reg_response = self.session.post(f"{self.base_url}/users/register", json=user_data)
        if reg_response.status_code == 200:
            user_id = reg_response.json()["user_id"]
            
            # Test extreme score
            extreme_score_data = {
                "user_id": user_id,
                "score": 999999999,  # Very high score
                "level": 100,
                "survival_time": 3600,
                "enemies_defeated": 1000,
                "flutterer_used": "basic_cosmic",
                "session_id": str(uuid.uuid4()),
                "timestamp": datetime.utcnow().isoformat()
            }
            
            response = self.session.post(f"{self.base_url}/users/{user_id}/score", json=extreme_score_data)
            if response.status_code == 200:
                self.log_test("Extreme Score Handling", "PASS", "Handles extreme score values correctly")
            else:
                self.log_test("Extreme Score Handling", "FAIL", f"Status code: {response.status_code}")
        else:
            self.log_test("Extreme Score Handling", "SKIP", "Could not create test user")
    
    def test_rate_limiting_and_cooldowns(self):
        """Test rate limiting and cooldown mechanisms"""
        print("=== Testing Rate Limiting & Cooldowns ===")
        
        # Create a test user for ad testing
        user_data = {
            "username": f"RateLimitUser_{uuid.uuid4().hex[:6]}",
            "device_id": f"rate_device_{uuid.uuid4().hex[:8]}",
            "platform": "android",
            "email": f"rate_{uuid.uuid4().hex[:6]}@test.com"
        }
        
        reg_response = self.session.post(f"{self.base_url}/users/register", json=user_data)
        if reg_response.status_code == 200:
            user_id = reg_response.json()["user_id"]
            
            # Test ad cooldown
            # First ad should succeed
            response1 = self.session.post(f"{self.base_url}/game/ad/rewarded?user_id={user_id}&ad_type=coins")
            if response1.status_code == 200:
                # Second ad immediately should fail due to cooldown
                response2 = self.session.post(f"{self.base_url}/game/ad/rewarded?user_id={user_id}&ad_type=coins")
                if response2.status_code == 429:
                    self.log_test("Ad Cooldown Enforcement", "PASS", "Cooldown properly enforced")
                else:
                    self.log_test("Ad Cooldown Enforcement", "FAIL", f"Expected 429, got {response2.status_code}")
            else:
                self.log_test("Ad Cooldown Enforcement", "FAIL", f"First ad failed: {response1.status_code}")
        else:
            self.log_test("Ad Cooldown Enforcement", "SKIP", "Could not create test user")
    
    def run_comprehensive_stress_tests(self):
        """Run all stress tests"""
        print("🔥 Starting Comprehensive Stress Testing for Butterfly Nebula Brawl Backend")
        print(f"Backend URL: {self.base_url}")
        print("=" * 80)
        
        # Create test users for concurrent operations
        user_ids = self.test_concurrent_user_registration(20)
        
        # Test concurrent score submissions
        self.test_concurrent_score_submissions(user_ids, 20)
        
        # Test performance benchmarks
        self.test_performance_benchmarks()
        
        # Test edge cases
        self.test_edge_cases()
        
        # Test rate limiting
        self.test_rate_limiting_and_cooldowns()
        
        print("=" * 80)
        print("🏁 Comprehensive Stress Testing Complete!")
        print(f"Created {len(user_ids)} test users for concurrent testing")

if __name__ == "__main__":
    tester = StressTester()
    tester.run_comprehensive_stress_tests()
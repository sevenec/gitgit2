#!/usr/bin/env python3
"""
Final Comprehensive Backend Validation for App Store Readiness
Tests all critical systems with detailed performance metrics and production readiness assessment
"""

import requests
import json
import uuid
import time
import statistics
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

class ProductionReadinessValidator:
    def __init__(self):
        self.base_url = API_BASE
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'ButterflyNebula-ProductionValidator/1.0'
        })
        self.performance_metrics = {}
        self.critical_issues = []
        self.test_results = {}
        
    def log_result(self, test_name, status, details="", is_critical=False):
        """Log test results with criticality assessment"""
        status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_symbol} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
        print()
        
        self.test_results[test_name] = {
            'status': status,
            'details': details,
            'critical': is_critical
        }
        
        if status == "FAIL" and is_critical:
            self.critical_issues.append(f"{test_name}: {details}")
    
    def measure_performance(self, func, *args, **kwargs):
        """Measure performance metrics"""
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            end_time = time.time()
            return result, (end_time - start_time) * 1000
        except Exception as e:
            end_time = time.time()
            return None, (end_time - start_time) * 1000
    
    def validate_critical_endpoints(self):
        """Validate all critical endpoints for App Store readiness"""
        print("🎯 VALIDATING CRITICAL ENDPOINTS FOR APP STORE READINESS")
        print("=" * 70)
        
        critical_endpoints = [
            ("Health Check", "GET", "/health", None, True),
            ("Root API", "GET", "/", None, True),
            ("Game Configuration", "GET", "/game/config", None, True),
            ("Flutterer Catalog", "GET", "/game/flutterers", None, True),
            ("Active Events", "GET", "/game/events", None, True)
        ]
        
        for name, method, endpoint, data, is_critical in critical_endpoints:
            response_times = []
            success_count = 0
            
            # Test each endpoint 5 times for reliability
            for i in range(5):
                if method == "GET":
                    response, response_time = self.measure_performance(
                        self.session.get, f"{self.base_url}{endpoint}"
                    )
                else:
                    response, response_time = self.measure_performance(
                        self.session.post, f"{self.base_url}{endpoint}", json=data
                    )
                
                if response and response.status_code == 200:
                    success_count += 1
                    response_times.append(response_time)
                
                time.sleep(0.1)
            
            # Assess results
            if success_count == 5:
                avg_time = statistics.mean(response_times)
                self.performance_metrics[name] = avg_time
                self.log_result(name, "PASS", 
                              f"100% success rate, avg response: {avg_time:.2f}ms", 
                              is_critical)
            else:
                self.log_result(name, "FAIL", 
                              f"Only {success_count}/5 requests successful", 
                              is_critical)
    
    def validate_user_management_flow(self):
        """Validate complete user management flow"""
        print("👤 VALIDATING USER MANAGEMENT FLOW")
        print("=" * 70)
        
        # Create test user
        user_data = {
            "username": f"AppStoreUser_{uuid.uuid4().hex[:6]}",
            "device_id": f"appstore_device_{uuid.uuid4().hex[:8]}",
            "platform": "ios",
            "email": f"appstore_{uuid.uuid4().hex[:6]}@test.com"
        }
        
        # Test user registration
        response, reg_time = self.measure_performance(
            self.session.post, f"{self.base_url}/users/register", json=user_data
        )
        
        if response and response.status_code == 200:
            user_data_response = response.json()
            user_id = user_data_response["user_id"]
            self.performance_metrics["User Registration"] = reg_time
            
            # Verify starter flutterer unlock
            if "flutterer_progress" in user_data_response and "basic_cosmic" in user_data_response["flutterer_progress"]:
                self.log_result("User Registration with Starter Flutterer", "PASS", 
                              f"User created with ID: {user_id}, starter flutterer unlocked, time: {reg_time:.2f}ms", 
                              True)
            else:
                self.log_result("User Registration with Starter Flutterer", "FAIL", 
                              "Starter flutterer not properly unlocked", True)
            
            # Test user profile retrieval
            response, get_time = self.measure_performance(
                self.session.get, f"{self.base_url}/users/{user_id}"
            )
            
            if response and response.status_code == 200:
                self.performance_metrics["Get User Profile"] = get_time
                self.log_result("Get User Profile", "PASS", 
                              f"Profile retrieved successfully, time: {get_time:.2f}ms", True)
                
                # Test score submission
                score_data = {
                    "user_id": user_id,
                    "score": 15750,
                    "level": 8,
                    "survival_time": 245,
                    "enemies_defeated": 42,
                    "flutterer_used": "basic_cosmic",
                    "session_id": str(uuid.uuid4()),
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                response, score_time = self.measure_performance(
                    self.session.post, f"{self.base_url}/users/{user_id}/score", json=score_data
                )
                
                if response and response.status_code == 200:
                    score_response = response.json()
                    coins_awarded = score_response.get("coins_awarded", 0)
                    self.performance_metrics["Score Submission"] = score_time
                    self.log_result("Score Submission with Coin Calculation", "PASS", 
                                  f"Score submitted, {coins_awarded} coins awarded, time: {score_time:.2f}ms", True)
                    
                    # Test leaderboard
                    response, lb_time = self.measure_performance(
                        self.session.get, f"{self.base_url}/users/{user_id}/leaderboard?limit=10"
                    )
                    
                    if response and response.status_code == 200:
                        leaderboard = response.json()
                        self.performance_metrics["Leaderboard"] = lb_time
                        self.log_result("Leaderboard Retrieval", "PASS", 
                                      f"Retrieved {len(leaderboard)} entries, time: {lb_time:.2f}ms", True)
                        return user_id
                    else:
                        self.log_result("Leaderboard Retrieval", "FAIL", 
                                      f"Status code: {response.status_code if response else 'No response'}", True)
                else:
                    self.log_result("Score Submission with Coin Calculation", "FAIL", 
                                  f"Status code: {response.status_code if response else 'No response'}", True)
            else:
                self.log_result("Get User Profile", "FAIL", 
                              f"Status code: {response.status_code if response else 'No response'}", True)
        else:
            self.log_result("User Registration with Starter Flutterer", "FAIL", 
                          f"Status code: {response.status_code if response else 'No response'}", True)
        
        return None
    
    def validate_monetization_systems(self, user_id):
        """Validate monetization and social features"""
        print("💰 VALIDATING MONETIZATION SYSTEMS")
        print("=" * 70)
        
        if not user_id:
            self.log_result("Monetization Systems", "SKIP", "No user ID available")
            return
        
        # Test rewarded ads
        response, ad_time = self.measure_performance(
            self.session.post, f"{self.base_url}/game/ad/rewarded?user_id={user_id}&ad_type=coins"
        )
        
        if response and response.status_code == 200:
            ad_response = response.json()
            reward_amount = ad_response.get("reward_amount", 0)
            self.performance_metrics["Rewarded Ads"] = ad_time
            self.log_result("Rewarded Ads System", "PASS", 
                          f"Ad reward: {reward_amount} coins, time: {ad_time:.2f}ms", True)
            
            # Test cooldown enforcement
            response2 = self.session.post(f"{self.base_url}/game/ad/rewarded?user_id={user_id}&ad_type=coins")
            if response2.status_code == 429:
                self.log_result("Ad Cooldown Enforcement", "PASS", "Cooldown properly enforced", True)
            else:
                self.log_result("Ad Cooldown Enforcement", "FAIL", 
                              f"Expected 429, got {response2.status_code}", True)
        else:
            self.log_result("Rewarded Ads System", "FAIL", 
                          f"Status code: {response.status_code if response else 'No response'}", True)
        
        # Test social sharing
        share_data = {
            "user_id": user_id,
            "score": 15750,
            "platform": "twitter"
        }
        
        response, share_time = self.measure_performance(
            self.session.post, f"{self.base_url}/game/share-score", params=share_data
        )
        
        if response and response.status_code == 200:
            share_response = response.json()
            coins_awarded = share_response.get("coins_awarded", 0)
            self.performance_metrics["Social Sharing"] = share_time
            self.log_result("Social Sharing System", "PASS", 
                          f"Share reward: {coins_awarded} coins, time: {share_time:.2f}ms", True)
        else:
            self.log_result("Social Sharing System", "FAIL", 
                          f"Status code: {response.status_code if response else 'No response'}", True)
    
    def validate_game_systems(self, user_id):
        """Validate game-specific systems"""
        print("🎮 VALIDATING GAME SYSTEMS")
        print("=" * 70)
        
        if not user_id:
            self.log_result("Game Systems", "SKIP", "No user ID available")
            return
        
        # Test flutterer unlock
        response, unlock_time = self.measure_performance(
            self.session.post, f"{self.base_url}/users/{user_id}/flutterer/unlock?flutterer_id=stardust_dancer"
        )
        
        if response and response.status_code == 200:
            self.performance_metrics["Flutterer Unlock"] = unlock_time
            self.log_result("Flutterer Unlock System", "PASS", 
                          f"Flutterer unlocked successfully, time: {unlock_time:.2f}ms", True)
        else:
            self.log_result("Flutterer Unlock System", "FAIL", 
                          f"Status code: {response.status_code if response else 'No response'}", True)
        
        # Test daily challenges
        response, challenge_time = self.measure_performance(
            self.session.get, f"{self.base_url}/users/{user_id}/daily-challenges"
        )
        
        if response and response.status_code == 200:
            challenges = response.json()
            self.performance_metrics["Daily Challenges"] = challenge_time
            self.log_result("Daily Challenges System", "PASS", 
                          f"Generated {len(challenges)} challenges, time: {challenge_time:.2f}ms", True)
        else:
            self.log_result("Daily Challenges System", "FAIL", 
                          f"Status code: {response.status_code if response else 'No response'}", True)
    
    def validate_data_persistence(self, user_id):
        """Validate data persistence and integrity"""
        print("💾 VALIDATING DATA PERSISTENCE")
        print("=" * 70)
        
        if not user_id:
            self.log_result("Data Persistence", "SKIP", "No user ID available")
            return
        
        # Get final user state
        response, get_time = self.measure_performance(
            self.session.get, f"{self.base_url}/users/{user_id}"
        )
        
        if response and response.status_code == 200:
            user_data = response.json()
            
            # Check coin persistence
            total_coins = user_data.get("cosmic_coins", 0)
            if total_coins > 0:
                self.log_result("Coin Persistence", "PASS", 
                              f"User has {total_coins} total coins", True)
            else:
                self.log_result("Coin Persistence", "FAIL", "No coins persisted", True)
            
            # Check game stats
            game_stats = user_data.get("game_stats", {})
            if game_stats.get("games_played", 0) > 0:
                self.log_result("Game Stats Persistence", "PASS", 
                              f"Games played: {game_stats.get('games_played')}, High score: {game_stats.get('high_score')}", True)
            else:
                self.log_result("Game Stats Persistence", "FAIL", "No game stats recorded", True)
            
            # Check flutterer progress
            flutterer_progress = user_data.get("flutterer_progress", {})
            if len(flutterer_progress) >= 2:  # Should have at least starter + unlocked
                self.log_result("Flutterer Progress Persistence", "PASS", 
                              f"User has {len(flutterer_progress)} flutterers unlocked", True)
            else:
                self.log_result("Flutterer Progress Persistence", "FAIL", 
                              f"Only {len(flutterer_progress)} flutterers unlocked", True)
        else:
            self.log_result("Data Persistence", "FAIL", 
                          f"Could not retrieve user data: {response.status_code if response else 'No response'}", True)
    
    def generate_performance_report(self):
        """Generate comprehensive performance report"""
        print("📊 PERFORMANCE ANALYSIS REPORT")
        print("=" * 70)
        
        if not self.performance_metrics:
            print("❌ No performance metrics collected")
            return
        
        # Calculate overall performance grade
        response_times = list(self.performance_metrics.values())
        avg_response_time = statistics.mean(response_times)
        p95_response_time = statistics.quantiles(response_times, n=20)[18] if len(response_times) >= 5 else avg_response_time
        
        # Performance grading
        if avg_response_time < 50:
            performance_grade = "EXCELLENT"
        elif avg_response_time < 100:
            performance_grade = "GOOD"
        elif avg_response_time < 200:
            performance_grade = "ACCEPTABLE"
        else:
            performance_grade = "NEEDS IMPROVEMENT"
        
        print(f"🎯 OVERALL PERFORMANCE GRADE: {performance_grade}")
        print(f"📈 Average Response Time: {avg_response_time:.2f}ms")
        print(f"📊 95th Percentile: {p95_response_time:.2f}ms")
        print()
        
        print("📋 DETAILED PERFORMANCE BREAKDOWN:")
        for endpoint, time_ms in sorted(self.performance_metrics.items(), key=lambda x: x[1]):
            status = "🟢" if time_ms < 50 else "🟡" if time_ms < 100 else "🔴"
            print(f"   {status} {endpoint}: {time_ms:.2f}ms")
        print()
    
    def generate_production_readiness_assessment(self):
        """Generate final production readiness assessment"""
        print("🚀 PRODUCTION READINESS ASSESSMENT")
        print("=" * 70)
        
        # Count test results
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result['status'] == 'PASS')
        failed_tests = sum(1 for result in self.test_results.values() if result['status'] == 'FAIL')
        critical_failures = len(self.critical_issues)
        
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"📊 TEST SUMMARY:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests} ({success_rate:.1f}%)")
        print(f"   Failed: {failed_tests}")
        print(f"   Critical Issues: {critical_failures}")
        print()
        
        # Production readiness determination
        if critical_failures == 0 and success_rate >= 95:
            readiness_status = "✅ READY FOR PRODUCTION"
            readiness_color = "🟢"
        elif critical_failures == 0 and success_rate >= 90:
            readiness_status = "⚠️ MOSTLY READY - MINOR ISSUES"
            readiness_color = "🟡"
        else:
            readiness_status = "❌ NOT READY - CRITICAL ISSUES"
            readiness_color = "🔴"
        
        print(f"{readiness_color} PRODUCTION READINESS: {readiness_status}")
        print()
        
        if self.critical_issues:
            print("🚨 CRITICAL ISSUES TO RESOLVE:")
            for issue in self.critical_issues:
                print(f"   ❌ {issue}")
            print()
        
        return success_rate, critical_failures
    
    def run_comprehensive_validation(self):
        """Run complete production readiness validation"""
        print("🎯 BUTTERFLY NEBULA BRAWL - COMPREHENSIVE BACKEND VALIDATION")
        print("🚀 App Store Production Readiness Assessment")
        print("=" * 80)
        
        # Validate critical endpoints
        self.validate_critical_endpoints()
        
        # Validate user management flow
        user_id = self.validate_user_management_flow()
        
        # Validate monetization systems
        self.validate_monetization_systems(user_id)
        
        # Validate game systems
        self.validate_game_systems(user_id)
        
        # Validate data persistence
        self.validate_data_persistence(user_id)
        
        # Generate reports
        self.generate_performance_report()
        success_rate, critical_failures = self.generate_production_readiness_assessment()
        
        print("=" * 80)
        print("🏁 COMPREHENSIVE BACKEND VALIDATION COMPLETE!")
        print(f"🎯 Final Assessment: {success_rate:.1f}% success rate, {critical_failures} critical issues")
        
        return success_rate, critical_failures

if __name__ == "__main__":
    validator = ProductionReadinessValidator()
    validator.run_comprehensive_validation()
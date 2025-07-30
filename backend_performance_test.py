#!/usr/bin/env python3
"""
Performance and Load Test Suite for Butterfly Nebula Brawl Backend
Tests response times, throughput, and system stability under load
"""

import requests
import json
import uuid
import time
import threading
from datetime import datetime
import statistics
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

class PerformanceAPITester:
    def __init__(self):
        self.base_url = API_BASE
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'ButterflyNebula-PerfTest/1.0'
        })
        self.response_times = []
        self.test_results = []
        
    def log_test(self, test_name, status, details=""):
        """Log test results"""
        status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_symbol} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
        print()
    
    def measure_response_time(self, func, *args, **kwargs):
        """Measure response time of a function"""
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        response_time = (end_time - start_time) * 1000  # Convert to milliseconds
        self.response_times.append(response_time)
        return result, response_time
    
    def test_endpoint_response_times(self):
        """Test response times for all critical endpoints"""
        print("=== Testing Endpoint Response Times ===")
        
        # Test health endpoint
        response, rt = self.measure_response_time(
            self.session.get, f"{self.base_url}/health"
        )
        if response.status_code == 200 and rt < 1000:  # Less than 1 second
            self.log_test("Health Endpoint Response Time", "PASS", f"{rt:.2f}ms")
        else:
            self.log_test("Health Endpoint Response Time", "FAIL", f"{rt:.2f}ms (Status: {response.status_code})")
        
        # Test game config endpoint
        response, rt = self.measure_response_time(
            self.session.get, f"{self.base_url}/game/config"
        )
        if response.status_code == 200 and rt < 2000:  # Less than 2 seconds
            self.log_test("Game Config Response Time", "PASS", f"{rt:.2f}ms")
        else:
            self.log_test("Game Config Response Time", "FAIL", f"{rt:.2f}ms (Status: {response.status_code})")
        
        # Test flutterer catalog endpoint
        response, rt = self.measure_response_time(
            self.session.get, f"{self.base_url}/game/flutterers"
        )
        if response.status_code == 200 and rt < 2000:  # Less than 2 seconds
            self.log_test("Flutterer Catalog Response Time", "PASS", f"{rt:.2f}ms")
        else:
            self.log_test("Flutterer Catalog Response Time", "FAIL", f"{rt:.2f}ms (Status: {response.status_code})")
    
    def test_user_registration_performance(self):
        """Test user registration performance under load"""
        print("=== Testing User Registration Performance ===")
        
        registration_times = []
        success_count = 0
        total_tests = 10
        
        for i in range(total_tests):
            user_data = {
                "username": f"PerfTest_{uuid.uuid4().hex[:6]}",
                "device_id": f"perf_test_{uuid.uuid4().hex[:8]}",
                "platform": "android",
                "email": f"perftest_{uuid.uuid4().hex[:6]}@test.com"
            }
            
            try:
                response, rt = self.measure_response_time(
                    self.session.post, f"{self.base_url}/users/register", json=user_data
                )
                registration_times.append(rt)
                if response.status_code == 200:
                    success_count += 1
            except Exception as e:
                print(f"Registration {i+1} failed: {str(e)}")
        
        if registration_times:
            avg_time = statistics.mean(registration_times)
            max_time = max(registration_times)
            min_time = min(registration_times)
            
            if avg_time < 3000 and success_count >= total_tests * 0.9:  # 90% success rate, avg < 3s
                self.log_test("User Registration Performance", "PASS", 
                            f"Avg: {avg_time:.2f}ms, Min: {min_time:.2f}ms, Max: {max_time:.2f}ms, Success: {success_count}/{total_tests}")
            else:
                self.log_test("User Registration Performance", "FAIL", 
                            f"Avg: {avg_time:.2f}ms, Success: {success_count}/{total_tests}")
    
    def test_concurrent_load(self):
        """Test system under concurrent load"""
        print("=== Testing Concurrent Load Handling ===")
        
        def make_concurrent_request(endpoint, results_list, thread_id):
            """Make a request and store result"""
            try:
                start_time = time.time()
                response = self.session.get(f"{self.base_url}{endpoint}")
                end_time = time.time()
                
                results_list.append({
                    'thread_id': thread_id,
                    'status_code': response.status_code,
                    'response_time': (end_time - start_time) * 1000,
                    'success': response.status_code == 200
                })
            except Exception as e:
                results_list.append({
                    'thread_id': thread_id,
                    'status_code': 0,
                    'response_time': 0,
                    'success': False,
                    'error': str(e)
                })
        
        # Test with 20 concurrent requests to health endpoint
        results = []
        threads = []
        num_threads = 20
        
        start_time = time.time()
        
        for i in range(num_threads):
            thread = threading.Thread(
                target=make_concurrent_request, 
                args=('/health', results, i)
            )
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        end_time = time.time()
        total_time = end_time - start_time
        
        # Analyze results
        successful_requests = sum(1 for r in results if r['success'])
        avg_response_time = statistics.mean([r['response_time'] for r in results if r['success']])
        
        if successful_requests >= num_threads * 0.95 and avg_response_time < 5000:  # 95% success, avg < 5s
            self.log_test("Concurrent Load Test", "PASS", 
                        f"Success: {successful_requests}/{num_threads}, Avg RT: {avg_response_time:.2f}ms, Total: {total_time:.2f}s")
        else:
            self.log_test("Concurrent Load Test", "FAIL", 
                        f"Success: {successful_requests}/{num_threads}, Avg RT: {avg_response_time:.2f}ms")
    
    def test_database_performance(self):
        """Test database operations performance"""
        print("=== Testing Database Performance ===")
        
        # Create a test user first
        user_data = {
            "username": f"DBPerfTest_{uuid.uuid4().hex[:6]}",
            "device_id": f"db_perf_test_{uuid.uuid4().hex[:8]}",
            "platform": "android",
            "email": f"dbperf_{uuid.uuid4().hex[:6]}@test.com"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/users/register", json=user_data)
            if response.status_code == 200:
                user_id = response.json()["user_id"]
                
                # Test multiple score submissions (database writes)
                write_times = []
                for i in range(5):
                    score_data = {
                        "user_id": user_id,
                        "score": 1000 + i * 100,
                        "level": i + 1,
                        "survival_time": 60 + i * 10,
                        "enemies_defeated": 10 + i * 5,
                        "flutterer_used": "basic_cosmic",
                        "session_id": str(uuid.uuid4()),
                        "timestamp": datetime.utcnow().isoformat()
                    }
                    
                    response, rt = self.measure_response_time(
                        self.session.post, f"{self.base_url}/users/{user_id}/score", json=score_data
                    )
                    if response.status_code == 200:
                        write_times.append(rt)
                
                # Test multiple user reads (database reads)
                read_times = []
                for i in range(5):
                    response, rt = self.measure_response_time(
                        self.session.get, f"{self.base_url}/users/{user_id}"
                    )
                    if response.status_code == 200:
                        read_times.append(rt)
                
                if write_times and read_times:
                    avg_write = statistics.mean(write_times)
                    avg_read = statistics.mean(read_times)
                    
                    if avg_write < 5000 and avg_read < 2000:  # Write < 5s, Read < 2s
                        self.log_test("Database Performance", "PASS", 
                                    f"Avg Write: {avg_write:.2f}ms, Avg Read: {avg_read:.2f}ms")
                    else:
                        self.log_test("Database Performance", "FAIL", 
                                    f"Avg Write: {avg_write:.2f}ms, Avg Read: {avg_read:.2f}ms")
                else:
                    self.log_test("Database Performance", "FAIL", "No successful operations")
            else:
                self.log_test("Database Performance", "FAIL", "Could not create test user")
        except Exception as e:
            self.log_test("Database Performance", "FAIL", f"Exception: {str(e)}")
    
    def test_memory_and_stability(self):
        """Test system stability over time"""
        print("=== Testing System Stability ===")
        
        # Make 50 requests over time to test stability
        stability_results = []
        
        for i in range(50):
            try:
                start_time = time.time()
                response = self.session.get(f"{self.base_url}/health")
                end_time = time.time()
                
                stability_results.append({
                    'request_num': i + 1,
                    'status_code': response.status_code,
                    'response_time': (end_time - start_time) * 1000,
                    'success': response.status_code == 200
                })
                
                # Small delay between requests
                time.sleep(0.1)
                
            except Exception as e:
                stability_results.append({
                    'request_num': i + 1,
                    'status_code': 0,
                    'response_time': 0,
                    'success': False,
                    'error': str(e)
                })
        
        # Analyze stability
        successful_requests = sum(1 for r in stability_results if r['success'])
        response_times = [r['response_time'] for r in stability_results if r['success']]
        
        if response_times:
            avg_rt = statistics.mean(response_times)
            rt_std = statistics.stdev(response_times) if len(response_times) > 1 else 0
            
            if successful_requests >= 48 and rt_std < 1000:  # 96% success, low variance
                self.log_test("System Stability", "PASS", 
                            f"Success: {successful_requests}/50, Avg RT: {avg_rt:.2f}ms, StdDev: {rt_std:.2f}ms")
            else:
                self.log_test("System Stability", "FAIL", 
                            f"Success: {successful_requests}/50, StdDev: {rt_std:.2f}ms")
        else:
            self.log_test("System Stability", "FAIL", "No successful requests")
    
    def generate_performance_summary(self):
        """Generate overall performance summary"""
        print("=== Performance Summary ===")
        
        if self.response_times:
            avg_rt = statistics.mean(self.response_times)
            median_rt = statistics.median(self.response_times)
            p95_rt = sorted(self.response_times)[int(len(self.response_times) * 0.95)]
            max_rt = max(self.response_times)
            min_rt = min(self.response_times)
            
            print(f"📊 Response Time Statistics:")
            print(f"   Average: {avg_rt:.2f}ms")
            print(f"   Median: {median_rt:.2f}ms")
            print(f"   95th Percentile: {p95_rt:.2f}ms")
            print(f"   Min: {min_rt:.2f}ms")
            print(f"   Max: {max_rt:.2f}ms")
            print(f"   Total Requests: {len(self.response_times)}")
            
            # Performance grade
            if avg_rt < 1000 and p95_rt < 3000:
                grade = "EXCELLENT"
            elif avg_rt < 2000 and p95_rt < 5000:
                grade = "GOOD"
            elif avg_rt < 5000 and p95_rt < 10000:
                grade = "ACCEPTABLE"
            else:
                grade = "NEEDS IMPROVEMENT"
            
            print(f"   Performance Grade: {grade}")
        else:
            print("❌ No performance data collected")
    
    def run_all_performance_tests(self):
        """Run all performance tests"""
        print("⚡ Starting Butterfly Nebula Brawl Backend Performance Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 80)
        
        self.test_endpoint_response_times()
        self.test_user_registration_performance()
        self.test_concurrent_load()
        self.test_database_performance()
        self.test_memory_and_stability()
        
        print("=" * 80)
        self.generate_performance_summary()
        print("🏁 Backend Performance Testing Complete!")

if __name__ == "__main__":
    tester = PerformanceAPITester()
    tester.run_all_performance_tests()
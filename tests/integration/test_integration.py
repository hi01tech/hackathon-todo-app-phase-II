#!/usr/bin/env python3
"""
Full-Stack Integration Test Suite
Tests frontend-backend integration for the Todo application
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name, passed, details=""):
    status = f"{Colors.GREEN}[PASS]{Colors.END}" if passed else f"{Colors.RED}[FAIL]{Colors.END}"
    print(f"{status} | {name}")
    if details:
        print(f"      {details}")

def test_backend_health():
    """Test 1: Backend Health Check"""
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        passed = response.status_code == 200 and response.json().get("status") == "healthy"
        print_test("Backend Health Check", passed, f"Status: {response.status_code}")
        return passed
    except Exception as e:
        print_test("Backend Health Check", False, f"Error: {str(e)}")
        return False

def test_frontend_serving():
    """Test 2: Frontend Serving"""
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        passed = response.status_code == 200 and "TaskFlow" in response.text
        print_test("Frontend Serving", passed, f"Status: {response.status_code}")
        return passed
    except Exception as e:
        print_test("Frontend Serving", False, f"Error: {str(e)}")
        return False

def test_user_signup():
    """Test 3: User Sign-Up"""
    try:
        timestamp = int(time.time())
        user_data = {
            "email": f"test{timestamp}@example.com",
            "password": "TestPass123!",
            "name": "Integration Test User"
        }

        response = requests.post(
            f"{BACKEND_URL}/api/auth/sign-up",
            json=user_data,
            timeout=5
        )

        passed = response.status_code == 200
        data = response.json() if passed else {}

        print_test(
            "User Sign-Up",
            passed,
            f"User ID: {data.get('user', {}).get('id', 'N/A')[:20]}..." if passed else f"Status: {response.status_code}"
        )

        return (passed, data.get("token") if passed else None, user_data["email"], user_data["password"])
    except Exception as e:
        print_test("User Sign-Up", False, f"Error: {str(e)}")
        return (False, None, None, None)

def test_user_signin(email, password):
    """Test 4: User Sign-In"""
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/auth/sign-in",
            json={"email": email, "password": password},
            timeout=5
        )

        passed = response.status_code == 200
        data = response.json() if passed else {}

        print_test(
            "User Sign-In",
            passed,
            f"Session ID: {data.get('session', {}).get('id', 'N/A')[:20]}..." if passed else f"Status: {response.status_code}"
        )

        return (passed, data.get("token") if passed else None)
    except Exception as e:
        print_test("User Sign-In", False, f"Error: {str(e)}")
        return (False, None)

def test_create_task(token):
    """Test 5: Create Task (Protected)"""
    try:
        task_data = {
            "title": "Integration Test Task",
            "description": "Testing task creation via API",
            "priority": "medium"
        }

        response = requests.post(
            f"{BACKEND_URL}/api/tasks",
            json=task_data,
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )

        passed = response.status_code in [200, 201]
        data = response.json() if passed else {}

        print_test(
            "Create Task",
            passed,
            f"Task ID: {data.get('id', 'N/A')}" if passed else f"Status: {response.status_code}, {response.text[:100]}"
        )

        return (passed, data.get("id") if passed else None)
    except Exception as e:
        print_test("Create Task", False, f"Error: {str(e)}")
        return (False, None)

def test_get_tasks(token):
    """Test 6: Get All Tasks (Protected)"""
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/tasks",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )

        passed = response.status_code == 200
        data = response.json() if passed else []

        print_test(
            "Get All Tasks",
            passed,
            f"Found {len(data)} tasks" if passed else f"Status: {response.status_code}"
        )

        return passed
    except Exception as e:
        print_test("Get All Tasks", False, f"Error: {str(e)}")
        return False

def test_update_task(token, task_id):
    """Test 7: Update Task (Protected)"""
    try:
        update_data = {
            "title": "Updated Integration Test Task",
            "status": "in_progress"
        }

        response = requests.put(  # Changed from PATCH to PUT
            f"{BACKEND_URL}/api/tasks/{task_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )

        passed = response.status_code == 200
        data = response.json() if passed else {}

        print_test(
            "Update Task",
            passed,
            f"Status: {data.get('status', 'N/A')}" if passed else f"Status: {response.status_code}"
        )

        return passed
    except Exception as e:
        print_test("Update Task", False, f"Error: {str(e)}")
        return False

def test_delete_task(token, task_id):
    """Test 8: Delete Task (Protected)"""
    try:
        response = requests.delete(
            f"{BACKEND_URL}/api/tasks/{task_id}",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )

        passed = response.status_code == 200  # Changed from 204 to 200

        print_test(
            "Delete Task",
            passed,
            "Task deleted successfully" if passed else f"Status: {response.status_code}"
        )

        return passed
    except Exception as e:
        print_test("Delete Task", False, f"Error: {str(e)}")
        return False

def test_unauthorized_access():
    """Test 9: Unauthorized Access (Security)"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/tasks", timeout=5)
        passed = response.status_code == 401

        print_test(
            "Unauthorized Access Blocked",
            passed,
            "Protected endpoints require auth" if passed else f"Status: {response.status_code}"
        )

        return passed
    except Exception as e:
        print_test("Unauthorized Access Blocked", False, f"Error: {str(e)}")
        return False

def main():
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}   Full-Stack Integration Test Suite{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}\n")

    results = []

    # Test 1: Backend Health
    results.append(test_backend_health())

    # Test 2: Frontend Serving
    results.append(test_frontend_serving())

    # Test 3: User Sign-Up
    signup_passed, token, test_email, test_password = test_user_signup()
    results.append(signup_passed)

    if not signup_passed:
        print(f"\n{Colors.RED}Cannot continue - signup failed{Colors.END}\n")
        return

    # Small delay before signin
    time.sleep(1)

    # Test 4: User Sign-In
    signin_passed, signin_token = test_user_signin(test_email, test_password)
    results.append(signin_passed)

    # Use signin token for remaining tests
    active_token = signin_token if signin_token else token

    # Use signin token for remaining tests
    active_token = signin_token if signin_token else token

    # Test 5: Create Task
    create_passed, task_id = test_create_task(active_token)
    results.append(create_passed)

    # Test 6: Get All Tasks
    results.append(test_get_tasks(active_token))

    # Test 7: Update Task
    if task_id:
        results.append(test_update_task(active_token, task_id))
    else:
        results.append(False)

    # Test 8: Delete Task
    if task_id:
        results.append(test_delete_task(active_token, task_id))
    else:
        results.append(False)

    # Test 9: Unauthorized Access
    results.append(test_unauthorized_access())

    # Summary
    total = len(results)
    passed = sum(results)
    failed = total - passed

    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}   Test Summary{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"Total Tests:  {total}")
    print(f"{Colors.GREEN}Passed:       {passed}{Colors.END}")
    print(f"{Colors.RED}Failed:       {failed}{Colors.END}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}\n")

    if passed == total:
        print(f"{Colors.GREEN}[SUCCESS] All integration tests passed!{Colors.END}\n")
    else:
        print(f"{Colors.YELLOW}[WARNING] Some tests failed - check details above{Colors.END}\n")

if __name__ == "__main__":
    main()

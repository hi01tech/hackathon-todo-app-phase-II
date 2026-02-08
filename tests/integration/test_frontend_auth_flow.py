#!/usr/bin/env python3
"""
Frontend Authentication Flow Test
Tests the complete user journey: signup -> signin -> create task
"""

import requests
import json
import time
from datetime import datetime

# Configuration
FRONTEND_URL = "http://localhost:3002"
BACKEND_URL = "http://localhost:8000"

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
    return passed

def test_better_auth_signup():
    """Test 1: Better Auth Sign-Up via Frontend"""
    print(f"\n{Colors.BLUE}Test 1: Better Auth Sign-Up{Colors.END}")

    try:
        timestamp = int(time.time())
        user_data = {
            "email": f"frontendtest{timestamp}@example.com",
            "password": "TestPass123!",
            "name": "Frontend Test User"
        }

        # Better Auth signup endpoint on frontend
        response = requests.post(
            f"{FRONTEND_URL}/api/auth/sign-up/email",
            json=user_data,
            headers={
                "Content-Type": "application/json",
                "Origin": FRONTEND_URL
            },
            timeout=30
        )

        passed = response.status_code in [200, 201]

        if passed:
            try:
                data = response.json()
                print_test(
                    "Better Auth Sign-Up",
                    True,
                    f"User created via Better Auth"
                )

                # Extract session cookies
                cookies = response.cookies
                return (True, user_data, cookies)
            except:
                print_test(
                    "Better Auth Sign-Up",
                    True,
                    f"User created (response parsing skipped)"
                )
                return (True, user_data, response.cookies)
        else:
            print_test(
                "Better Auth Sign-Up",
                False,
                f"Status: {response.status_code}, Body: {response.text[:200]}"
            )
            return (False, None, None)

    except Exception as e:
        print_test("Better Auth Sign-Up", False, f"Error: {str(e)}")
        return (False, None, None)

def test_better_auth_signin(user_data, cookies=None):
    """Test 2: Better Auth Sign-In via Frontend"""
    print(f"\n{Colors.BLUE}Test 2: Better Auth Sign-In{Colors.END}")

    try:
        # Better Auth signin endpoint on frontend
        response = requests.post(
            f"{FRONTEND_URL}/api/auth/sign-in/email",
            json={
                "email": user_data["email"],
                "password": user_data["password"]
            },
            headers={
                "Content-Type": "application/json",
                "Origin": FRONTEND_URL
            },
            cookies=cookies or {},
            timeout=30
        )

        passed = response.status_code in [200, 201]

        if passed:
            session_cookies = response.cookies
            print_test(
                "Better Auth Sign-In",
                True,
                f"Authenticated via Better Auth"
            )
            return (True, session_cookies)
        else:
            print_test(
                "Better Auth Sign-In",
                False,
                f"Status: {response.status_code}, Body: {response.text[:200]}"
            )
            return (False, None)

    except Exception as e:
        print_test("Better Auth Sign-In", False, f"Error: {str(e)}")
        return (False, None)

def test_get_jwt_token(cookies):
    """Test 3: Get JWT Token from Better Auth"""
    print(f"\n{Colors.BLUE}Test 3: Get JWT Token{Colors.END}")

    try:
        # Custom backend-compatible token endpoint
        response = requests.get(
            f"{FRONTEND_URL}/api/token",
            headers={"Origin": FRONTEND_URL},
            cookies=cookies,
            timeout=30
        )

        if response.status_code == 200:
            try:
                data = response.json()
                token = data.get('token') or data.get('data', {}).get('token')

                if token:
                    print_test(
                        "Get JWT Token",
                        True,
                        f"Token: {token[:30]}..."
                    )
                    return (True, token)
                else:
                    print_test(
                        "Get JWT Token",
                        False,
                        f"No token in response: {data}"
                    )
                    return (False, None)
            except:
                print_test(
                    "Get JWT Token",
                    False,
                    f"Failed to parse token response"
                )
                return (False, None)
        else:
            print_test(
                "Get JWT Token",
                False,
                f"Status: {response.status_code}"
            )
            return (False, None)

    except Exception as e:
        print_test("Get JWT Token", False, f"Error: {str(e)}")
        return (False, None)

def test_backend_create_task_with_token(token):
    """Test 4: Create Task on Backend with JWT Token"""
    print(f"\n{Colors.BLUE}Test 4: Create Task on Backend{Colors.END}")

    try:
        task_data = {
            "title": "Frontend Integration Test Task",
            "description": "Created via frontend auth flow",
            "priority": "high"
        }

        response = requests.post(
            f"{BACKEND_URL}/api/tasks",
            json=task_data,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            timeout=30
        )

        passed = response.status_code in [200, 201]

        if passed:
            data = response.json()
            print_test(
                "Create Task with JWT",
                True,
                f"Task ID: {data.get('id', 'N/A')}"
            )
            return (True, data.get('id'))
        else:
            print_test(
                "Create Task with JWT",
                False,
                f"Status: {response.status_code}, Body: {response.text[:200]}"
            )
            return (False, None)

    except Exception as e:
        print_test("Create Task with JWT", False, f"Error: {str(e)}")
        return (False, None)

def test_backend_get_tasks_with_token(token):
    """Test 5: Get Tasks from Backend with JWT Token"""
    print(f"\n{Colors.BLUE}Test 5: Get Tasks from Backend{Colors.END}")

    try:
        response = requests.get(
            f"{BACKEND_URL}/api/tasks",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            timeout=30
        )

        passed = response.status_code == 200

        if passed:
            tasks = response.json()
            task_count = len(tasks) if isinstance(tasks, list) else 0
            print_test(
                "Get Tasks with JWT",
                True,
                f"Retrieved {task_count} tasks"
            )
            return True
        else:
            print_test(
                "Get Tasks with JWT",
                False,
                f"Status: {response.status_code}"
            )
            return False

    except Exception as e:
        print_test("Get Tasks with JWT", False, f"Error: {str(e)}")
        return False

def main():
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}   Frontend Authentication Flow Test{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}\n")

    results = []

    # Test 1: Sign up via Better Auth
    signup_passed, user_data, signup_cookies = test_better_auth_signup()
    results.append(signup_passed)

    if not signup_passed:
        print(f"\n{Colors.RED}Signup failed - cannot continue{Colors.END}\n")
        return

    time.sleep(1)

    # Test 2: Sign in via Better Auth
    signin_passed, session_cookies = test_better_auth_signin(user_data, signup_cookies)
    results.append(signin_passed)

    if not signin_passed:
        print(f"\n{Colors.RED}Signin failed - cannot continue{Colors.END}\n")
        return

    # Test 3: Get JWT token from Better Auth
    token_passed, jwt_token = test_get_jwt_token(session_cookies)
    results.append(token_passed)

    if not token_passed:
        print(f"\n{Colors.YELLOW}JWT token retrieval failed - backend integration may not work{Colors.END}\n")
        jwt_token = None

    if jwt_token:
        # Test 4: Create task on backend with JWT
        create_passed, task_id = test_backend_create_task_with_token(jwt_token)
        results.append(create_passed)

        # Test 5: Get tasks from backend with JWT
        get_passed = test_backend_get_tasks_with_token(jwt_token)
        results.append(get_passed)
    else:
        results.append(False)
        results.append(False)
        print(f"\n{Colors.YELLOW}Skipped backend tests - no JWT token{Colors.END}")

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
        print(f"{Colors.GREEN}[SUCCESS] All frontend auth flow tests passed!{Colors.END}\n")
    else:
        print(f"{Colors.YELLOW}[WARNING] Some tests failed - check details above{Colors.END}\n")

if __name__ == "__main__":
    main()

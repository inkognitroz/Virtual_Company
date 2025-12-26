#!/bin/bash

# Backend API Test Script
# This script tests all the backend API endpoints

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:5000/api}"
TEST_EMAIL="test@example.com"
TEST_USERNAME="testuser"
TEST_PASSWORD="testpassword123"
TEST_NAME="Test User"

echo "=========================================="
echo "Virtual Company Backend API Tests"
echo "=========================================="
echo "API URL: $API_URL"
echo ""

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        if [ ! -z "$3" ]; then
            echo "  Error: $3"
        fi
    fi
}

# Test 1: Health Check
echo "Test 1: Health Check"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    print_result 0 "Health check endpoint"
else
    print_result 1 "Health check endpoint" "HTTP $HTTP_CODE"
    exit 1
fi
echo ""

# Test 2: User Registration
echo "Test 2: User Registration"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$TEST_EMAIL\",
        \"username\": \"$TEST_USERNAME\",
        \"password\": \"$TEST_PASSWORD\",
        \"name\": \"$TEST_NAME\"
    }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "400" ]; then
    TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
    if [ ! -z "$TOKEN" ]; then
        print_result 0 "User registration"
    else
        # User might already exist
        echo -e "${YELLOW}⚠ SKIP${NC}: User registration (user may already exist)"
    fi
else
    print_result 1 "User registration" "HTTP $HTTP_CODE"
fi
echo ""

# Test 3: User Login
echo "Test 3: User Login"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"username\": \"$TEST_USERNAME\",
        \"password\": \"$TEST_PASSWORD\"
    }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
    if [ ! -z "$TOKEN" ]; then
        print_result 0 "User login"
    else
        print_result 1 "User login" "No token in response"
        exit 1
    fi
else
    print_result 1 "User login" "HTTP $HTTP_CODE"
    exit 1
fi
echo ""

# Test 4: Get Current User
echo "Test 4: Get Current User (Protected Route)"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/me" \
    -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    print_result 0 "Get current user with authentication"
else
    print_result 1 "Get current user" "HTTP $HTTP_CODE"
fi
echo ""

# Test 5: Create Role
echo "Test 5: Create Role"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/roles" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "name": "Test Manager",
        "avatar": "👨‍💼",
        "description": "A test manager role",
        "aiInstructions": "You are a helpful manager"
    }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
    ROLE_ID=$(echo "$BODY" | grep -o '"_id":"[^"]*' | grep -o '[^"]*$' | head -n 1)
    print_result 0 "Create role"
else
    print_result 1 "Create role" "HTTP $HTTP_CODE"
fi
echo ""

# Test 6: Get All Roles
echo "Test 6: Get All Roles"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/roles" \
    -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    # Get the first role ID if we don't have one from creation
    if [ -z "$ROLE_ID" ]; then
        ROLE_ID=$(echo "$BODY" | grep -o '"_id":"[^"]*' | grep -o '[^"]*$' | head -n 1)
    fi
    print_result 0 "Get all roles"
else
    print_result 1 "Get all roles" "HTTP $HTTP_CODE"
fi
echo ""

# Test 7: Get Single Role
if [ ! -z "$ROLE_ID" ]; then
    echo "Test 7: Get Single Role"
    RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/roles/$ROLE_ID" \
        -H "Authorization: Bearer $TOKEN")

    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Get single role"
    else
        print_result 1 "Get single role" "HTTP $HTTP_CODE"
    fi
    echo ""
fi

# Test 8: Create Message
echo "Test 8: Create Message"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/messages" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
        \"sender\": \"$TEST_NAME\",
        \"senderType\": \"user\",
        \"content\": \"This is a test message\"
    }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
    MESSAGE_ID=$(echo "$BODY" | grep -o '"_id":"[^"]*' | grep -o '[^"]*$' | head -n 1)
    print_result 0 "Create message"
else
    print_result 1 "Create message" "HTTP $HTTP_CODE"
fi
echo ""

# Test 9: Get All Messages
echo "Test 9: Get All Messages"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/messages" \
    -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
    print_result 0 "Get all messages"
else
    print_result 1 "Get all messages" "HTTP $HTTP_CODE"
fi
echo ""

# Test 10: Authentication Without Token
echo "Test 10: Authentication Without Token (Should Fail)"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/roles")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "401" ]; then
    print_result 0 "Request without token properly rejected"
else
    print_result 1 "Request without token" "Expected 401, got $HTTP_CODE"
fi
echo ""

echo "=========================================="
echo "Tests Complete!"
echo "=========================================="

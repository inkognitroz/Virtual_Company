#!/bin/bash
# Integration test script for Virtual Company API

API_URL="http://localhost:3000"
FAILED=0
PASSED=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "Virtual Company API Integration Tests"
echo "========================================"
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
RESPONSE=$(curl -s -w "\n%{http_code}" $API_URL/api/health)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Health check returned 200"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} - Health check returned $HTTP_CODE"
    ((FAILED++))
fi
echo ""

# Test 2: User Registration
echo "Test 2: User Registration"
RANDOM_USER="testuser_$(date +%s)"
REG_RESPONSE=$(curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${RANDOM_USER}@example.com\",\"username\":\"${RANDOM_USER}\",\"password\":\"testpass123\",\"name\":\"Test User\"}")

if echo "$REG_RESPONSE" | jq -e '.token' > /dev/null 2>&1; then
    TOKEN=$(echo "$REG_RESPONSE" | jq -r '.token')
    echo -e "${GREEN}✓ PASSED${NC} - User registered successfully"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} - Registration failed"
    echo "Response: $REG_RESPONSE"
    ((FAILED++))
fi
echo ""

# Test 3: User Login
echo "Test 3: User Login"
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${RANDOM_USER}\",\"password\":\"testpass123\"}")

if echo "$LOGIN_RESPONSE" | jq -e '.token' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC} - Login successful"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} - Login failed"
    echo "Response: $LOGIN_RESPONSE"
    ((FAILED++))
fi
echo ""

# Test 4: Create Role (Authenticated)
echo "Test 4: Create Role (with authentication)"
ROLE_ID="test-role-$(date +%s)"
ROLE_RESPONSE=$(curl -s -X POST $API_URL/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"id\":\"${ROLE_ID}\",\"name\":\"Test Manager\",\"avatar\":\"👨‍💼\",\"description\":\"Test role\",\"aiInstructions\":\"Test instructions\"}")

if echo "$ROLE_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC} - Role created successfully"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} - Role creation failed"
    echo "Response: $ROLE_RESPONSE"
    ((FAILED++))
fi
echo ""

# Test 5: Get Roles
echo "Test 5: Get Roles"
GET_ROLES_RESPONSE=$(curl -s $API_URL/api/roles \
  -H "Authorization: Bearer $TOKEN")

if echo "$GET_ROLES_RESPONSE" | jq -e '.[0].id' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC} - Roles retrieved successfully"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} - Get roles failed"
    echo "Response: $GET_ROLES_RESPONSE"
    ((FAILED++))
fi
echo ""

# Test 6: Create Message
echo "Test 6: Create Message"
MSG_RESPONSE=$(curl -s -X POST $API_URL/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"sender\":\"user\",\"senderName\":\"Test User\",\"avatar\":\"👤\",\"content\":\"Test message\",\"time\":\"10:30 AM\"}")

if echo "$MSG_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC} - Message created successfully"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} - Message creation failed"
    echo "Response: $MSG_RESPONSE"
    ((FAILED++))
fi
echo ""

# Test 7: Get Messages
echo "Test 7: Get Messages"
GET_MSG_RESPONSE=$(curl -s $API_URL/api/messages \
  -H "Authorization: Bearer $TOKEN")

if echo "$GET_MSG_RESPONSE" | jq -e '.[0].content' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC} - Messages retrieved successfully"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} - Get messages failed"
    echo "Response: $GET_MSG_RESPONSE"
    ((FAILED++))
fi
echo ""

# Test 8: Update AI Config
echo "Test 8: Update AI Config"
AI_CONFIG_RESPONSE=$(curl -s -X PUT $API_URL/api/ai-config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"provider\":\"openai\",\"voiceEnabled\":true}")

if echo "$AI_CONFIG_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC} - AI config updated successfully"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} - AI config update failed"
    echo "Response: $AI_CONFIG_RESPONSE"
    ((FAILED++))
fi
echo ""

# Test 9: Unauthorized Request
echo "Test 9: Unauthorized Request (should fail)"
UNAUTH_RESPONSE=$(curl -s $API_URL/api/roles)

if echo "$UNAUTH_RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC} - Unauthorized request correctly rejected"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} - Unauthorized request should have been rejected"
    ((FAILED++))
fi
echo ""

# Summary
echo "========================================"
echo "Test Summary"
echo "========================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed! ✗${NC}"
    exit 1
fi

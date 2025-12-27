#!/bin/bash

# API Test Script for BlueMoon Backend
# Run this script to test all API endpoints

BASE_URL="http://localhost:5000/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "BlueMoon API Test Script"
echo "========================================="
echo ""

# 1. Login to get token
echo -e "${YELLOW}1. Testing Authentication...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin123","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}✗ Login failed!${NC}"
  echo "$LOGIN_RESPONSE"
  exit 1
else
  echo -e "${GREEN}✓ Login successful - Token obtained${NC}"
fi

# Function to test endpoint
test_endpoint() {
  local METHOD=$1
  local ENDPOINT=$2
  local DESCRIPTION=$3
  local DATA=$4
  
  if [ "$METHOD" == "GET" ]; then
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$ENDPOINT" \
      -H "Authorization: Bearer $TOKEN")
  else
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X $METHOD "$BASE_URL$ENDPOINT" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$DATA")
  fi
  
  if [ "$RESPONSE" == "200" ] || [ "$RESPONSE" == "201" ]; then
    echo -e "${GREEN}✓ $METHOD $ENDPOINT - $DESCRIPTION (HTTP $RESPONSE)${NC}"
  elif [ "$RESPONSE" == "404" ]; then
    echo -e "${YELLOW}○ $METHOD $ENDPOINT - $DESCRIPTION (HTTP $RESPONSE - Not Found/No Data)${NC}"
  else
    echo -e "${RED}✗ $METHOD $ENDPOINT - $DESCRIPTION (HTTP $RESPONSE)${NC}"
  fi
}

echo ""
echo -e "${YELLOW}2. Testing GET Endpoints (Read Operations)...${NC}"

# Roles (Public endpoint)
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/roles")
if [ "$RESPONSE" == "200" ]; then
  echo -e "${GREEN}✓ GET /roles - List all roles (HTTP $RESPONSE)${NC}"
else
  echo -e "${RED}✗ GET /roles - List all roles (HTTP $RESPONSE)${NC}"
fi

# Protected endpoints
test_endpoint "GET" "/dashboard/stats" "Dashboard statistics"
test_endpoint "GET" "/households" "List all households"
test_endpoint "GET" "/users" "List all users"
test_endpoint "GET" "/residents" "List all residents"
test_endpoint "GET" "/fee-types" "List all fee types"
test_endpoint "GET" "/fee-periods" "List all fee periods"
test_endpoint "GET" "/statistics/households" "Household statistics"
test_endpoint "GET" "/statistics/residents" "Resident statistics"
test_endpoint "GET" "/invoices/my-invoices" "My invoices"
test_endpoint "GET" "/period-fees/in-period/1" "Fees in period 1"
test_endpoint "GET" "/residents/by-household/4" "Residents in household 4"

echo ""
echo -e "${YELLOW}3. Summary${NC}"
echo "========================================="
echo "All API endpoints have been tested."
echo "Green (✓) = Success"
echo "Yellow (○) = No data found (but endpoint works)"
echo "Red (✗) = Error"
echo "========================================="

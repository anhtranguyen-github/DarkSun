#!/bin/bash
# Household Comprehensive Functional Tests - automated_tests/test_household.sh
BASE_URL="http://127.0.0.1:5000/api"

# Get Token
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_manager","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "--------------------------------------------------"
echo "RUNNING COMPREHENSIVE HOUSEHOLD TESTS"
echo "--------------------------------------------------"

# TC-HH-03: Create Household with Empty Address (BUG-H-02)
echo "[TC-HH-03] Create Household with Empty Address"
curl -s -X POST "$BASE_URL/households" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"householdCode":"EMPTY_ADDR","addressStreet":"","owner":{"fullName":"Test","idCardNumber":"123999"}}' | grep -q "success.*true"
if [ $? -eq 0 ]; then echo "RESULT: FAIL (Should not allow empty address)"; else echo "RESULT: PASS"; fi

# TC-HH-05: Change Owner - Reset old owner (BUG-H-01)
# Note: This is hard to automate without checking DB state, but we can check the logic flow.
echo "[TC-HH-05] Change Owner Logic Verification"
echo "Manual verification required for reset old owner state. Reporting current behavior."

# TC-HH-06: Negative Area (-100)
echo "[TC-HH-06] Negative Area Value"
curl -s -X POST "$BASE_URL/households" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"householdCode":"NEG_AREA","area":-100,"owner":{"fullName":"Neg","idCardNumber":"987"}}' | grep -q "success\":true"
if [ $? -eq 0 ]; then echo "RESULT: FAIL (Should not allow negative area)"; else echo "RESULT: PASS"; fi

# TC-HH-07: Stored XSS in address
echo "[TC-HH-07] Stored XSS in Address"
curl -s -X POST "$BASE_URL/households" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"householdCode":"XSS_HOUSE","addressStreet":"<script>alert(1)</script>","owner":{"fullName":"XSS","idCardNumber":"XXX"}}' | grep -q "success\":true"
if [ $? -eq 0 ]; then echo "RESULT: FAIL (Security: Allowed XSS payload in address)"; else echo "RESULT: PASS"; fi

echo "--------------------------------------------------"

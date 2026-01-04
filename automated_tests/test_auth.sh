#!/bin/bash
# Auth Comprehensive Functional Tests - automated_tests/test_auth.sh
BASE_URL="http://localhost:5000/api"

echo "--------------------------------------------------"
echo "RUNNING COMPREHENSIVE AUTH TESTS"
echo "--------------------------------------------------"

# TC-AUTH-01: Valid Login
echo "[TC-AUTH-01] Valid Login"
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_admin","password":"password123"}' | grep -q "success.*true"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-AUTH-04: Password Too Short (Negative)
echo "[TC-AUTH-04] Password Too Short (<6 chars)"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"shortpw","password":"123","fullName":"Short PW","roleId":2}' | grep -q "error\|message"
# If it returns success:true, then it's a FAIL for our expectations
if curl -s -X POST "$BASE_URL/auth/register" -H "Content-Type: application/json" -d '{"username":"shortpw","password":"123","fullName":"Short PW","roleId":2}' | grep -q "success\":true"; then 
  echo "RESULT: FAIL (Should have blocked short password)"; 
else 
  echo "RESULT: PASS"; 
fi

# TC-AUTH-07: Register as Admin (Privilege Escalation)
echo "[TC-AUTH-07] Register with Admin roleId (Privilege Escalation)"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"hacker_admin","password":"password123","fullName":"Hacker","roleId":1}' | grep -q "success\":true"
if [ $? -eq 0 ]; then echo "RESULT: FAIL (Security Hole: Anyone can register as Admin)"; else echo "RESULT: PASS"; fi

# TC-AUTH-08: Malformed Token Header (Server Stability)
echo "[TC-AUTH-08] Malformed Header 'Bearer' (No Token)"
response=$(curl -s -X GET "$BASE_URL/households" -H "Authorization: Bearer")
if echo "$response" | grep -q "500\|Internal Server Error"; then
    echo "RESULT: FAIL (Server Exception: Crash/Unhandled)";
else
    echo "RESULT: PASS";
fi

# TC-AUTH-09: Type Juggling (Gửi mảng thay vì string)
echo "[TC-AUTH-09] Type Juggling: Send password as Array"
response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_admin","password":["password123"]}')
if echo "$response" | grep -q "500\|error"; then
    echo "RESULT: FAIL (Server Exception)";
else
    echo "RESULT: PASS";
fi

echo "--------------------------------------------------"

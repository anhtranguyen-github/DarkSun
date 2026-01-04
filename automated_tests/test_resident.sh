#!/bin/bash
# Resident Comprehensive Functional Tests - automated_tests/test_resident.sh
BASE_URL="http://localhost:5000/api"

# Get Tokens
TOKEN_MANAGER=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_totruong","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

TOKEN_CUDAN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_cudan","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "--------------------------------------------------"
echo "RUNNING COMPREHENSIVE RESIDENT TESTS"
echo "--------------------------------------------------"

# TC-RES-03: Delete Owner Resident (BUG-R-01)
echo "[TC-RES-03] Delete Owner Resident"
# Resident ID 1 is usually the admin/demo owner in seeds
curl -s -X DELETE "$BASE_URL/residents/1" \
  -H "Authorization: Bearer $TOKEN_MANAGER" | grep -q "success.*true"
if [ $? -eq 0 ]; then echo "RESULT: FAIL (Should not allow deleting the owner of a household)"; else echo "RESULT: PASS"; fi

# TC-RES-05: IDOR - Resident A view Resident B
echo "[TC-RES-05] IDOR: Cư dân xem thông tin hộ khác"
curl -s -X GET "$BASE_URL/residents/2" \
  -H "Authorization: Bearer $TOKEN_CUDAN" | grep -q "403\|Forbidden\|Không có quyền"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL (Security: IDOR allowed)"; fi

# TC-RES-09: Stored XSS in Name
echo "[TC-RES-09] Stored XSS in Resident Name"
curl -s -X POST "$BASE_URL/residents" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_MANAGER" \
  -d '{"householdId":1,"fullName":"<script>alert(1)</script>","dateOfBirth":"2000-01-01","gender":"Nam"}' | grep -q "success\":true"
if [ $? -eq 0 ]; then echo "RESULT: FAIL (Security: Allowed XSS in resident name)"; else echo "RESULT: PASS"; fi

echo "--------------------------------------------------"

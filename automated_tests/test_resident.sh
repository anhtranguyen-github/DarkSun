#!/bin/bash
# Comprehensive Resident Tests - automated_tests/test_resident.sh
BASE_URL="http://127.0.0.1:5000/api"

TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"username":"demo_manager","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "--------------------------------------------------"
echo "RUNNING COMPREHENSIVE RESIDENT TESTS"
echo "--------------------------------------------------"

HH_ID=$(curl -s -X GET "$BASE_URL/households" -H "Authorization: Bearer $TOKEN" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$HH_ID" ]; then
    echo "No household found. Skipping tests."
    exit 0
fi

# TC-RES-01: Valid Create
echo "[TC-RES-01] Valid Resident Creation"
RES=$(curl -s -X POST "$BASE_URL/residents" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID',"fullName":"Test Resident","dateOfBirth":"2000-01-01","gender":"Nam"}')
echo "$RES" | grep -q "success.*true"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-RES-02: Duplicate ID Card
echo "[TC-RES-02] Duplicate ID Card"
curl -s -X POST "$BASE_URL/residents" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID',"fullName":"Dup","dateOfBirth":"2000-01-01","gender":"Nam","idCardNumber":"123456789"}' > /dev/null
curl -s -X POST "$BASE_URL/residents" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID',"fullName":"Dup2","dateOfBirth":"2000-01-01","gender":"Nam","idCardNumber":"123456789"}' | grep -q "đã tồn tại"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-RES-03: Delete Owner
OWNER_ID=$(curl -s -X GET "$BASE_URL/households/$HH_ID" -H "Authorization: Bearer $TOKEN" | grep -o '"ownerId":[0-9]*' | cut -d':' -f2)
echo "[TC-RES-03] Delete Owner Resident (ID: $OWNER_ID)"
curl -s -X DELETE "$BASE_URL/residents/$OWNER_ID" -H "Authorization: Bearer $TOKEN" | grep -q "CHỦ HỘ"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-RES-04: Future Birth Date
echo "[TC-RES-04] Future Birth Date"
curl -s -X POST "$BASE_URL/residents" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID',"fullName":"Future Kid","dateOfBirth":"2099-01-01","gender":"Nam"}' | grep -q "tương lai"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-RES-05: Invalid ID Card Format
echo "[TC-RES-05] Invalid ID Card Format (ABC123)"
curl -s -X POST "$BASE_URL/residents" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID',"fullName":"Bad ID","dateOfBirth":"2000-01-01","gender":"Nam","idCardNumber":"ABC123456"}' | grep -q "9 hoặc 12"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-RES-06: Short Name (<2 chars)
echo "[TC-RES-06] Name Too Short"
curl -s -X POST "$BASE_URL/residents" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID',"fullName":"A","dateOfBirth":"2000-01-01","gender":"Nam"}' | grep -q "không hợp lệ"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-RES-07: Household Not Found
echo "[TC-RES-07] Household Not Found"
curl -s -X POST "$BASE_URL/residents" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":999999,"fullName":"Test","dateOfBirth":"2000-01-01","gender":"Nam"}' | grep -q "không tồn tại"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-RES-08: Missing Required Fields
echo "[TC-RES-08] Missing Required Fields"
curl -s -X POST "$BASE_URL/residents" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID'}' | grep -q "bắt buộc"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

echo "--------------------------------------------------"

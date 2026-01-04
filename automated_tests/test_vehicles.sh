#!/bin/bash
# Comprehensive Vehicle Tests - automated_tests/test_vehicles.sh
BASE_URL="http://127.0.0.1:5000/api"

TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"username":"demo_manager","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "--------------------------------------------------"
echo "RUNNING COMPREHENSIVE VEHICLE TESTS"
echo "--------------------------------------------------"

HH_ID=$(curl -s -X GET "$BASE_URL/households" -H "Authorization: Bearer $TOKEN" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$HH_ID" ]; then
    echo "No household found. Skipping tests."
    exit 0
fi

# TC-VEH-01: Valid Registration
echo "[TC-VEH-01] Valid Registration"
PLATE="TEST-$(date +%s)"
curl -s -X POST "$BASE_URL/vehicles" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID',"licensePlate":"'$PLATE'","type":"Oto"}' | grep -q "success.*true"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-VEH-02: Duplicate Plate
echo "[TC-VEH-02] Duplicate License Plate"
curl -s -X POST "$BASE_URL/vehicles" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID',"licensePlate":"'$PLATE'","type":"Oto"}' | grep -q "đã tồn tại"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-VEH-03: Long License Plate
echo "[TC-VEH-03] Long License Plate (>20 chars)"
curl -s -X POST "$BASE_URL/vehicles" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID',"licensePlate":"VERYLONGLICENSEPLATE123456","type":"Oto"}' | grep -q "quá dài"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-VEH-04: Invalid Vehicle Type
echo "[TC-VEH-04] Invalid Vehicle Type (MayBay)"
curl -s -X POST "$BASE_URL/vehicles" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID',"licensePlate":"PLANE-001","type":"MayBay"}' | grep -q "không hợp lệ"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-VEH-05: Household Not Found
echo "[TC-VEH-05] Household Not Found"
curl -s -X POST "$BASE_URL/vehicles" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":999999,"licensePlate":"TEST-999","type":"XeMay"}' | grep -q "không tồn tại"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-VEH-06: Missing Required Fields
echo "[TC-VEH-06] Missing Required Fields"
curl -s -X POST "$BASE_URL/vehicles" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID'}' | grep -q "Thiếu thông tin"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-VEH-07: XeDapDien Type
echo "[TC-VEH-07] Valid XeDapDien Type"
curl -s -X POST "$BASE_URL/vehicles" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":'$HH_ID',"licensePlate":"EBIKE-'$(date +%s)'","type":"XeDapDien"}' | grep -q "success.*true"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-VEH-08: Get Vehicles by Household
echo "[TC-VEH-08] Get Vehicles by Household"
curl -s -X GET "$BASE_URL/vehicles?householdId=$HH_ID" -H "Authorization: Bearer $TOKEN" | grep -q "success.*true"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

echo "--------------------------------------------------"

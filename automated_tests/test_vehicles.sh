#!/bin/bash
# Vehicles Functional Tests - automated_tests/test_vehicles.sh
BASE_URL="http://localhost:5000/api"

# Get Token
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_totruong","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "--------------------------------------------------"
echo "RUNNING VEHICLE TESTS"
echo "--------------------------------------------------"

# TC-VEH-01: Valid Registration
echo "[TC-VEH-01] Valid Registration"
curl -s -X POST "$BASE_URL/vehicles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":1,"licensePlate":"29A-888.88","type":"Oto","name":"Camry"}' | grep -q "success.*true"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-VEH-02: Duplicate License Plate
echo "[TC-VEH-02] Duplicate License Plate"
curl -s -X POST "$BASE_URL/vehicles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"householdId":1,"licensePlate":"29A-888.88","type":"Oto"}' | grep -q "đã tồn tại"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

echo "--------------------------------------------------"

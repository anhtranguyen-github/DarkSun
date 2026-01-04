#!/bin/bash
# User Management Tests - automated_tests/test_user_management.sh
BASE_URL="http://127.0.0.1:5000/api"

# Get Admin Token and ID
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_admin","password":"password123"}')

TOKEN_ADMIN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
MY_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

echo "--------------------------------------------------"
echo "RUNNING USER MANAGEMENT TESTS"
echo "--------------------------------------------------"

# TC-USER-05: Delete Last Admin Protection
echo "[TC-USER-05] Protection: Delete Last Admin (ID: $MY_ID)"
curl -s -X DELETE "$BASE_URL/users/$MY_ID" \
  -H "Authorization: Bearer $TOKEN_ADMIN" | grep -q "Admin duy nhất\|tự xóa chính mình\|không thể xóa"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-USER-10: Self-Service Mass Assignment
echo "[TC-USER-10] Mass Assignment Protection"
TOKEN_CUDAN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_cu_dan","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -s -X PUT "$BASE_URL/me/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_CUDAN" \
  -d '{"fullName":"Hacker","roleId":1}' | grep -q "không có quyền cập nhật"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

echo "--------------------------------------------------"

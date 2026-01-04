#!/bin/bash
echo "1. Logging in as Admin..."
LOGIN_RES=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_admin","password":"password123"}')
TOKEN=$(echo $LOGIN_RES | jq -r '.token')

if [ "$TOKEN" == "null" ]; then
  echo "Login failed!"
  echo $LOGIN_RES
  exit 1
fi
echo "Login Success. Token acquired."

echo "2. Fetching Roles to find Manager ID..."
ROLES_RES=$(curl -s -X GET http://localhost:5000/api/roles -H "Authorization: Bearer $TOKEN")
MANAGER_ID=$(echo $ROLES_RES | jq '.data[] | select(.name=="manager") | .id')
echo "Manager Role ID: $MANAGER_ID"

echo "3. Creating New Manager User..."
CREATE_RES=$(curl -s -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"test_manager_99\",\"password\":\"password123\",\"fullName\":\"Test Manager Created By Admin\",\"roleId\":$MANAGER_ID}")

echo "Response:"
echo $CREATE_RES

SUCCESS=$(echo $CREATE_RES | jq '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✅ TEST PASS: Admin created user successfully."
else
  echo "❌ TEST FAIL: Could not create user."
fi

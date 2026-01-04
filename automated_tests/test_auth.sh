#!/bin/bash
# Comprehensive Auth Tests - automated_tests/test_auth.sh
BASE_URL="http://127.0.0.1:5000/api"

echo "--------------------------------------------------"
echo "RUNNING COMPREHENSIVE AUTH TESTS"
echo "--------------------------------------------------"

# TC-AUTH-01: Valid Login
echo "[TC-AUTH-01] Valid Login"
RES=$(curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"username":"demo_admin","password":"password123"}')
echo "$RES" | grep -q "token"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-AUTH-02: Empty Username
echo "[TC-AUTH-02] Empty Username"
curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"username":"","password":"password123"}' | grep -q "400\|lỗi\|không hợp lệ"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-AUTH-03: Wrong Password
echo "[TC-AUTH-03] Wrong Password"
curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"username":"demo_admin","password":"wrongpass"}' | grep -q "không đúng"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-AUTH-04: Password Too Short
echo "[TC-AUTH-04] Password Too Short (<6 chars)"
curl -s -X POST "$BASE_URL/auth/register" -H "Content-Type: application/json" -d '{"username":"u_short_'$(date +%s)'","password":"123","fullName":"Short PW"}' | grep -q "6 ký tự"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-AUTH-07: Privilege Escalation
echo "[TC-AUTH-07] Register with Admin roleId"
curl -s -X POST "$BASE_URL/auth/register" -H "Content-Type: application/json" -d '{"username":"u_hacker_'$(date +%s)'","password":"password123","fullName":"Hacker","roleId":1}' | grep -q "quản trị viên"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-AUTH-09: Type Juggling
echo "[TC-AUTH-09] Type Juggling: Password as Array"
curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"username":"demo_admin","password":["password123"]}' | grep -q "Định dạng dữ liệu không hợp lệ"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-AUTH-10: Username as Array
echo "[TC-AUTH-10] Type Juggling: Username as Array"
curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"username":["demo_admin"],"password":"password123"}' | grep -q "Định dạng dữ liệu không hợp lệ"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-AUTH-11: SQL Injection
echo "[TC-AUTH-11] SQL Injection in username"
curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"username":"\" OR 1=1 --","password":"test"}' | grep -q "không đúng\|không tìm thấy"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-AUTH-12: Missing Bearer Token
echo "[TC-AUTH-12] Missing Bearer Token"
curl -s -X GET "$BASE_URL/households" -H "Authorization: Bearer " | grep -q "Token không hợp lệ\|401"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

echo "--------------------------------------------------"

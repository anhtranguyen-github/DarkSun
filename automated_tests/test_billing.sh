#!/bin/bash
# Billing Comprehensive Functional Tests - automated_tests/test_billing.sh
BASE_URL="http://localhost:5000/api"

# Get Tokens
TOKEN_ACCOUNTANT=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_ketoan","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

TOKEN_CUDAN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_cudan","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "--------------------------------------------------"
echo "RUNNING COMPREHENSIVE BILLING TESTS"
echo "--------------------------------------------------"

# TC-BIL-04: Record double payment
echo "[TC-BIL-04] Double Payment Logic check"
curl -s -X POST "$BASE_URL/invoices/pay/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_ACCOUNTANT" \
  -d '{"paymentMethod":"TienMat"}' | grep -q "đã được thanh toán"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL (Should not allow paying already paid invoice)"; fi

# TC-BIL-05: IDOR - Resident view invoice of other household
echo "[TC-BIL-05] IDOR: Cư dân xem hóa đơn nhà khác"
# Assuming invoice ID 2 belongs to someone else
curl -s -X GET "$BASE_URL/invoices/2" \
  -H "Authorization: Bearer $TOKEN_CUDAN" | grep -q "403\|Forbidden\|Không có quyền"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL (Security: IDOR allow viewing other's invoice)"; fi

# TC-BIL-06: Negative Payment Amount
echo "[TC-BIL-06] Negative Payment Amount Injected"
# This might need a specialized endpoint but let's test general logic
curl -s -X POST "$BASE_URL/invoices/pay/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_ACCOUNTANT" \
  -d '{"amount": -500000, "paymentMethod":"TienMat"}' | grep -q "error\|Invalid"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL (Should not allow negative financial values)"; fi

echo "--------------------------------------------------"

#!/bin/bash
# Comprehensive Billing Tests - automated_tests/test_billing.sh
BASE_URL="http://127.0.0.1:5000/api"

TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"username":"demo_accountant","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "--------------------------------------------------"
echo "RUNNING COMPREHENSIVE BILLING TESTS"
echo "--------------------------------------------------"

# TC-BIL-01: Get All Invoices
echo "[TC-BIL-01] Get All Invoices"
curl -s -X GET "$BASE_URL/invoices" -H "Authorization: Bearer $TOKEN" | grep -q "success.*true"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-BIL-02: Invoice Not Found
echo "[TC-BIL-02] Invoice Not Found"
curl -s -X PUT "$BASE_URL/invoices/999999/pay" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"paymentMethod":"TienMat"}' | grep -q "không tồn tại"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

# TC-BIL-03: Negative Amount Payment
echo "[TC-BIL-03] Negative Amount Payment"
INVOICE_ID=$(curl -s -X GET "$BASE_URL/invoices?status=unpaid" -H "Authorization: Bearer $TOKEN" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
if [ -n "$INVOICE_ID" ]; then
  curl -s -X PUT "$BASE_URL/invoices/$INVOICE_ID/pay" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"amount":-500000,"paymentMethod":"TienMat"}' | grep -q "không hợp lệ"
  if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi
else
  echo "RESULT: SKIP (No unpaid invoice)"
fi

# TC-BIL-04: Double Payment
echo "[TC-BIL-04] Double Payment Check"
PAID_ID=$(curl -s -X GET "$BASE_URL/invoices?status=paid" -H "Authorization: Bearer $TOKEN" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
if [ -n "$PAID_ID" ]; then
  curl -s -X PUT "$BASE_URL/invoices/$PAID_ID/pay" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"paymentMethod":"TienMat"}' | grep -q "đã được thanh toán"
  if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi
else
  echo "RESULT: SKIP (No paid invoice)"
fi

# TC-BIL-05: Notes Too Long
echo "[TC-BIL-05] Notes Too Long (>500 chars)"
LONG_NOTES=$(printf 'A%.0s' {1..600})
if [ -n "$INVOICE_ID" ]; then
  curl -s -X PUT "$BASE_URL/invoices/$INVOICE_ID/pay" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"paymentMethod":"TienMat","notes":"'$LONG_NOTES'"}' | grep -q "quá dài"
  if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi
else
  echo "RESULT: SKIP (No unpaid invoice)"
fi

# TC-BIL-06: Filter by Status
echo "[TC-BIL-06] Filter by Status"
curl -s -X GET "$BASE_URL/invoices?status=unpaid" -H "Authorization: Bearer $TOKEN" | grep -q "success.*true"
if [ $? -eq 0 ]; then echo "RESULT: PASS"; else echo "RESULT: FAIL"; fi

echo "--------------------------------------------------"

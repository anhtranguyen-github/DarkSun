#!/bin/bash
# API Integration Test Script for BlueMoon Backend v2.0
# Tests all routes, RBAC, and core features

BASE_URL="http://localhost:5000/api"

echo "==============================================="
echo "BlueMoon Backend v2.0 - API Integration Tests"
echo "==============================================="

# Helper function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4
    local expected=$5
    local description=$6
    
    if [ -n "$data" ]; then
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token")
    fi
    
    if echo "$response" | grep -q "$expected"; then
        echo "✅ PASS: $description"
    else
        echo "❌ FAIL: $description"
        echo "   Response: $response"
    fi
}

# Login helper
get_token() {
    local username=$1
    local response=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$username\",\"password\":\"password123\"}")
    echo $response | grep -o '"token":"[^"]*"' | cut -d'"' -f4
}

# ===========================
# 1. Authentication Tests
# ===========================
echo ""
echo "=== 1. AUTHENTICATION ==="

ADMIN_TOKEN=$(get_token "demo_admin")
if [ -n "$ADMIN_TOKEN" ]; then echo "✅ Admin login success"; else echo "❌ Admin login failed"; fi

MANAGER_TOKEN=$(get_token "demo_totruong")
if [ -n "$MANAGER_TOKEN" ]; then echo "✅ Manager login success"; else echo "❌ Manager login failed"; fi

ACCOUNTANT_TOKEN=$(get_token "demo_ketoan")
if [ -n "$ACCOUNTANT_TOKEN" ]; then echo "✅ Accountant login success"; else echo "❌ Accountant login failed"; fi

CUDAN_TOKEN=$(get_token "demo_cudan")
if [ -n "$CUDAN_TOKEN" ]; then echo "✅ Cư Dân login success"; else echo "❌ Cư Dân login failed"; fi

# ===========================
# 2. RBAC Tests
# ===========================
echo ""
echo "=== 2. RBAC / Authorization ==="

# Test: No token should return 401
response=$(curl -s -X GET "$BASE_URL/households")
if echo "$response" | grep -q "401\|Không có quyền"; then
    echo "✅ PASS: No token returns 401"
else
    echo "❌ FAIL: No token should return 401"
fi

# Test: Manager can access households
test_endpoint "GET" "/households" "$MANAGER_TOKEN" "" "success" "Manager can access /households"

# Test: Accountant can access fee-types
test_endpoint "GET" "/fee-types" "$ACCOUNTANT_TOKEN" "" "success" "Accountant can access /fee-types"

# Test: Cư Dân CANNOT access households
response=$(curl -s -X GET "$BASE_URL/households" -H "Authorization: Bearer $CUDAN_TOKEN")
if echo "$response" | grep -q "403\|không có quyền"; then
    echo "✅ PASS: Cư Dân CANNOT access /households (403)"
else
    echo "❌ FAIL: Cư Dân should NOT access /households"
fi

# Test: Accountant CANNOT create household (Manager domain)
response=$(curl -s -X POST "$BASE_URL/households" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCOUNTANT_TOKEN" \
    -d '{"householdCode":"TEST001","owner":{"fullName":"Test","idCardNumber":"123"}}')
if echo "$response" | grep -q "403\|không có quyền"; then
    echo "✅ PASS: Accountant CANNOT create household (403)"
else
    echo "❌ FAIL: Accountant should NOT create household"
fi

# ===========================
# 3. Self-Service Tests (Cổng Cư Dân)
# ===========================
echo ""
echo "=== 3. SELF-SERVICE (Cổng Cư Dân) ==="

test_endpoint "GET" "/me/profile" "$CUDAN_TOKEN" "" "success.*demo_cudan" "Cư Dân can view their profile"
test_endpoint "GET" "/me/invoices" "$CUDAN_TOKEN" "" "success" "Cư Dân can view their invoices"
test_endpoint "PUT" "/me/profile" "$CUDAN_TOKEN" '{"email":"cudan@example.com"}' "success" "Cư Dân can update their email"

# ===========================
# 4. CRUD Operations
# ===========================
echo ""
echo "=== 4. CRUD Operations ==="

# Create Household (as Manager)
response=$(curl -s -X POST "$BASE_URL/households" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $MANAGER_TOKEN" \
    -d '{"householdCode":"HK-TEST-100","addressStreet":"100 Test St","addressWard":"Ward 1","addressDistrict":"District 1","owner":{"fullName":"Nguyen Van B","idCardNumber":"001234567891","dateOfBirth":"1995-05-20","gender":"Nam"}}')
if echo "$response" | grep -q "success.*true"; then
    echo "✅ PASS: Create household HK-TEST-100"
else
    echo "❌ FAIL: Create household HK-TEST-100"
    echo "   Response: $response"
fi

# ===========================
# 5. Statistics/Dashboard
# ===========================
echo ""
echo "=== 5. Statistics ==="

test_endpoint "GET" "/dashboard/stats" "$ADMIN_TOKEN" "" "success\|200" "Dashboard stats accessible"

echo ""
echo "==============================================="
echo "API Integration Tests Complete"
echo "==============================================="

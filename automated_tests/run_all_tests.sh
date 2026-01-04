#!/bin/bash
# Master Test Runner - automated_tests/run_all_tests.sh

chmod +x automated_tests/*.sh

echo "=================================================="
echo "BLUEMOON SYSTEM - COMPREHENSIVE QA REGRESSION SUITE"
echo "=================================================="

./automated_tests/test_auth.sh
./automated_tests/test_household.sh
./automated_tests/test_resident.sh
./automated_tests/test_billing.sh
./automated_tests/test_vehicles.sh

echo "=================================================="
echo "ALL TESTS COMPLETED"
echo "=================================================="

# Test Plans UML Folder

This folder contains PlantUML representations of the business validation logic test reports.

## Files
- `auth_test_plan.puml`: Authentication & Authorization.
- `billing_test_plan.puml`: Billing & Invoicing logic.
- `dashboard_test_plan.puml`: Data visualization & Export.
- `fee_type_test_plan.puml`: Fee configuration & Dependencies.
- `household_test_plan.puml`: Household management & Cascade checks.
- `resident_test_plan.puml`: Personal data & National ID validation.
- `self_service_test_plan.puml`: Resident portal & Privilege escalation.
- `temp_residence_test_plan.puml`: Temporary residence logic.
- `user_management_test_plan.puml`: RBAC & Admin protection.
- `vehicle_test_plan.puml`: Vehicle registration & Sanitization.

- `non_functional_test_plan.puml`: Performance, Security, Usability, etc.

## Filtering & Numbering Logic
To maintain readability and provide the most value:
- **IDOR scenarios removed**: Replaced with specific business logic or validation rules.
- **XSS scenarios kept**: Critical for security verification.
- **Continuous Numbering**: `STT` (Sequence Number) is continuous from 1 to 126 across all files to represent a single unified test suite.
- **Business Logic added**: Focus on referential integrity, calculation formulas, and state locks.

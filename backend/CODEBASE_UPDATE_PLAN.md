# Codebase Update & Testing Plan (v2.0 Compliance)

This plan details the roadmap to update Controllers, Routes, and Middleware to match the new v2.0 Database Schema. **Every component must have a corresponding test file.**

## Phase 1: Foundation (Auth & Middleware)
**Goal:** Secure the application and enforce the new RBAC roles (`admin`, `manager`, `accountant`).

### 1.1 Middleware
*   **Create/Update:** `middleware/authMiddleware.js`
    *   `verifyToken`: Check JWT validity.
    *   `authorizeClasses`: Generic RBAC check (e.g., `authorize(['admin', 'manager'])`).
*   **Test:** `tests/middleware/authMiddleware.test.js` (Mock req/res to verify 401/403/200 responses).

### 1.2 Auth Module
*   **Controller:** `controllers/authController.js`
    *   `login`: Return JWT + User Role info.
    *   `changePassword`: Self-service password change.
    *   `register`: (Admin Only) Create new staff accounts.
*   **Route:** `routes/auth.routes.js`
*   **Test:** `tests/controllers/authController.test.js` & `tests/routes/auth.routes.test.js`

---

## Phase 2: Demographics Module (The "Manager" Domain)
**Goal:** Manage Households, Residents, and Temporary stays.

### 2.1 Household Management
*   **Controller:** `controllers/householdController.js`
    *   `create`: Create household + Assign Owner (Strict FK).
    *   `update`: Update address/members.
    *   `getDetails`: Return household info + vehicle list + resident list.
*   **Route:** `routes/household.routes.js`
*   **Test:** `tests/controllers/householdController.test.js`

### 2.2 Resident Management
*   **Controller:** `controllers/residentController.js`
    *   `create`: Full v2.0 fields (Native place, Alias, etc.).
    *   `update`: Edit demographic info.
    *   `move`: Handle "Chuyen den" / "Chuyen di".
*   **Route:** `routes/resident.routes.js`
*   **Test:** `tests/controllers/residentController.test.js`

### 2.3 Temporary Residence (Tam Tru / Tam Vang)
*   **Controller:** `controllers/tempResidenceController.js`
    *   `register`: Create record (TamTru/TamVang).
    *   `list`: Filter by type/date.
*   **Route:** `routes/tempResidence.routes.js`
*   **Test:** `tests/controllers/tempResidenceController.test.js`

---

## Phase 3: Vehicle Module (The "Parking" Domain)
**Goal:** Manage vehicle registry for fee calculation.

### 3.1 Vehicle Management
*   **Controller:** `controllers/vehicleController.js`
    *   `register`: Add vehicle to Household (Check license plate uniqueness).
    *   `delete`: Remove vehicle (Stop parking fee).
*   **Route:** `routes/vehicle.routes.js`
*   **Test:** `tests/controllers/vehicleController.test.js`

---

## Phase 4: Financial Module (The "Accountant" Domain)
**Goal:** Fee definitions, monthly invoicing, and payment collection.

### 4.1 Fee Configuration
*   **Controller:** `controllers/feeController.js`
    *   `createType`: Define new fee or contribution campaign.
    *   `createPeriod`: Open new month for collection.
*   **Route:** `routes/fee.routes.js`
*   **Test:** `tests/controllers/feeController.test.js`

### 4.2 Invoicing & Collection
*   **Controller:** `controllers/invoiceController.js`
    *   `generateMonthly`: Auto-calc fees:
        *   Sanitation: 6k * Resident Count.
        *   Parking: 70k * Bike + 1.2M * Car.
        *   Service: Manual input (Elec/Water).
    *   `recordPayment`: Update status, `paidDate`, `cashierId`.
*   **Route:** `routes/invoice.routes.js`
*   **Test:** `tests/controllers/invoiceController.test.js` (Crucial logic test).

---

## Phase 5: Reporting Module
**Goal:** Statistical views for Admin/Managers.

### 5.1 Statistics
*   **Controller:** `controllers/reportController.js`
    *   `getDemographicsStats`: Population changes, temporary residence counts.
    *   `getRevenueStats`: Paid vs Unpaid, Total collected by campaign.
*   **Route:** `routes/report.routes.js`
*   **Test:** `tests/controllers/reportController.test.js`

---

## Execution Strategy
1.  **Order:** Core Middleware -> Auth -> Demographics -> Vehicles -> Financials.
2.  **Testing Policy:**
    *   **Unit Tests:** Jest mocks for Models to test Controller logic independently.
    *   **Integration Tests:** Supertest calls to Routes to verify End-to-End flow (DB interactions).

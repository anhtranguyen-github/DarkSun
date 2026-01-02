# Role-Based Access Control (RBAC) Specification - Version v2.0
**Target Version:** v2.0 (Includes all v1.0 features)

Based on the requirements for the "BlueMoon Apartment Management System", the RBAC design is streamlined around the concept of the **"Ban Quản Trị" (Management Board)**. The text explicitly mentions capabilities available to the Management Board.

In practice, a Management Board is often divided into specialized functional roles (Manager, Accountant) to respect the "Principle of Least Privilege," though the requirements treat them as a unified "Ban Quản Trị" actor.

## 1. Defined Roles

We will define three distinct roles to cover the "Ban Quản Trị" functions while allowing for future separation of duties.

| Role Code (`name`) | Display Name (`display_name`) | Description |
| :--- | :--- | :--- |
| **`admin`** | **Quản Trị Viên (System)** | Full system access. Used for configuring the system, managing other user accounts (Role assignments), and disaster recovery. |
| **`manager`** | **Tổ Trưởng (Manager)** | The primary operational role. Responsible for demographics (Residents/Households) and reporting to authorities. |
| **`accountant`** | **Kế Toán (Accountant)** | specialized financial role. Responsible for defining fees, generating invoices, recording payments, and statistical reporting. |

*(Note: In smaller deployments, one user account might be assigned BOTH `manager` and `accountant` roles to act as a full "Ban Quản Trị" member.)*

## 2. Permission Matrix (v2.0 Scope)

| Feature Module | Function | `admin` | `manager` | `accountant` | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Auth** | Login / Logout | ✅ | ✅ | ✅ | |
| **Auth** | Change Personal Password | ✅ | ✅ | ✅ | |
| **Auth** | Manage User Accounts | ✅ | ❌ | ❌ | Create accounts for other board members. |
| **Demographics** (v1.0) | View Household/Resident List | ✅ | ✅ | ✅ | Accountants need this to link fees. |
| **Demographics** (v1.0) | **CRUD** Household/Resident | ✅ | ✅ | ❌ | Core duty of "Tổ Trưởng". |
| **Demographics** (v1.0) | Manage Temporary Residence | ✅ | ✅ | ❌ | "Tạm trú/Tạm vắng" reporting. |
| **Vehicles** (v2.0) | View Vehicle List | ✅ | ✅ | ✅ | |
| **Vehicles** (v2.0) | **CRUD** Vehicle Info | ✅ | ✅ | ❌ | Manager verifies ownership; Accountant bills it. |
| **Fees** (v1.0/2.0) | Configure Fee Types | ✅ | ❌ | ✅ | Setting prices (e.g., 70k/bike). |
| **Fees** (v2.0) | Import Utility Usage (Elec/Water) | ✅ | ❌ | ✅ | "Thu hộ" logic. |
| **Invoices** (v1.0) | Generate Monthly Invoices | ✅ | ❌ | ✅ | |
| **Payments** (v1.0) | Record Payments (Nộp tiền) | ✅ | ❌ | ✅ | "Quản lý thu phí". |
| **Reports** | View Revenue Statistics | ✅ | ✅ | ✅ | "Tra cứu, thống kê". |

## 3. Implementation Details for v2.0

### 3.1 Database Updates
*   **Role Table:**
    *   `name`: (String, Unique) - `admin`, `manager`, `accountant`
    *   `display_name`: (String) - "Quản trị viên", "Tổ trưởng", "Kế toán"
    *   `description`: (Text) - "System Admin", "Demographics Manager", "Financial Officer"

### 3.2 Default Accounts (Seeding)
To facilitate immediate use of v2.0 functionalities:

*   **User:** `admin` / **Role:** [`admin`]
*   **User:** `totruong` / **Role:** [`manager`]
*   **User:** `ketoan` / **Role:** [`accountant`]
*   **User:** `banquantri` / **Role:** [`manager`, `accountant`] *(Super-user for small teams)*

### 3.3 Security Rules
*   **Middlewares:**
    *   `verifyToken`: Authentication check.
    *   `isManager`: Checks if user has `manager` OR `admin` role.
    *   `isAccountant`: Checks if user has `accountant` OR `admin` role.

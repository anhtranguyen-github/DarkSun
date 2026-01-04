# 🌙 BlueMoon Apartment Management System

Premium Apartment Management System built with **React (Vite)**, **Node.js (Sequelize)**, and **PostgreSQL**.

---

## ⚡ Quick Start

One script to rule them all. Launch the system with a single command and choose between **Native** or **Docker** setup.

### 1. Windows
Double-click `run.bat` or run:
```cmd
run.bat
```

### 2. Linux / macOS / WSL
Run:
```bash
./run.sh
```

---

### 🔑 Demo Accounts
All accounts use the default password: **`password123`**

| Role (EN/VN) | Username | Permissions |
| :--- | :--- | :--- |
| **Admin** (Quản trị viên) | `admin123` | Full Audit, User Management, Create Staff |
| **Manager** (Tổ Trưởng) | `demo_manager` | CRUD Users (excl. Admins), Manage Households/Residents |
| **Deputy** (Tổ Phó) | `demo_deputy` | **Read-Only** access to Resident/Household data, View Stats |
| **Accountant** (Kế Toán) | `demo_accountant` | Full Financial Management (Fees, Invoices, Payments) |
| **Resident** (Cư Dân) | `demo_resident` | View personal bills & Profile |

> **Note:** We have removed the 'Lock Account' feature to simplify operations. Deleting a user serves as a soft-delete/deactivation.

---

## 🔥 New Features (v2.2)
- **Refined RBAC Rules**:
  - **Managers** can manage all users *except* Admins. They cannot create, delete, or assign the 'Admin' role.
  - **Deputies** now have strict **Read-Only** access to sensitive data (Households, Residents) but can view Dashboard analytics.
  - **Admins** retain exclusive control over system configuration and other Admin accounts.
- **Enhanced Security**:
  - **API Protection**: Backend strictly filters Admin accounts from non-admin lists and blocks unauthorized status updates.
  - **UI Consistency**: Buttons and inputs are dynamically hidden based on detailed permission checks.
- **Database Standardization**:
  - Fully migrated all legacy Vietnamese role codes (`quan_ly`, `ke_toan`) to English (`manager`, `accountant`).
  - Use `npm run db:setup` (in backend) for a complete clean slate & re-seed.

---

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, Vite, Lucide Icons.
- **Backend**: Node.js, Express, Sequelize ORM.
- **Database**: PostgreSQL (External/Render).
- **Security**: JWT Authentication, Argon2/Bcrypt Hashing, Role-Based Access Control (RBAC).

## 🛡️ Quality Assurance & Testing

The system has undergone rigorous testing including:
- **Comprehensive Test Suite**: 120+ test cases covering Happy Path, Exceptions, and Security.
- **Automated Regression**: Shell scripts to verify API integrity and RBAC logic.
- **Security Audit**: Simulated hacker attacks (SQLi, XSS, IDOR, Privilege Escalation).

For detailed reports, see:
- `TEST_REPORT.md`: Master summary.
- `test_reports/`: Detailed functional group reports.
- `automated_tests/`: Execution scripts for QA validation.

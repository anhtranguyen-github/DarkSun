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
| **Admin** (Quản trị viên) | `admin123` | Full Audit & System Control |
| **Manager** (Tổ Trưởng) | `demo_manager` | Resident & Household Mgmt |
| **Accountant** (Kế Toán) | `demo_accountant` | Billing, Fee Mgmt, Invoices |
| **Deputy** (Tổ Phó) | `demo_deputy` | Assistant Management |
| **Resident** (Cư Dân) | `demo_resident` | View personal bills & Profile |

> **Note:** We have standardized role codes to English (`manager`, `resident`...) while keeping Vietnamese display names. If you cannot log in, please restart the server.

---

## 🔥 New Features (v2.1)
- **Enhanced Security**: 
  - Restricted public registration to **Residents** only (Anti-Privilege Escalation).
  - Admins must now explicitly create Manager/Accountant accounts via Dashboard or API.
- **Admin Dashboard**:
  - New "Create User" interface for direct staff account provisioning.
  - Localized role display names (Tổ Trưởng, Kế Toán...).
- **Role Standardization**: 
  - Unified RBAC system using standard English identifiers across Backend/Database.

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

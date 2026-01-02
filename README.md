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

## 🔑 Demo Accounts
All accounts use the default password: **`password123`**

| Role | Username | Permissions |
| :--- | :--- | :--- |
| **Master Admin** | `admin123` | Full Audit & System Control |
| **Admin (Demo)** | `demo_admin` | Full System Access |
| **Accountant** | `demo_ketoan` | Billing, Fee Mgmt, Invoices |
| **Manager** | `demo_totruong` | Resident & Household Mgmt |
| **Deputy Manager** | `demo_topho` | Assistant Management |
| **Resident** | `demo_cudan` | View personal bills & Profile |

> **Note:** All passwords have been unified to **`password123`**. If you cannot log in, please ensure you have run the launcher (`run.sh` / `run.bat`) at least once to synchronize the database roles.

---

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, Vite, Lucide Icons.
- **Backend**: Node.js, Express, Sequelize ORM.
- **Database**: PostgreSQL (External/Render).
- **Security**: JWT Authentication, Argon2/Bcrypt Hashing, Role-Based Access Control (RBAC).

## 📊 Features
- **Real-time Stats Dashboard**: Visualize resident density and fee collection status.
- **Dynamic RBAC**: Permissions are checked at both frontend (Guards) and backend (Middleware) levels.
- **Automated Billing**: Generate invoices automatically based on household area and member counts.
- **Premium UI**: Dark mode glassmorphism interface with smooth transitions and optimized scrollbars.

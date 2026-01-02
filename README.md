# 🌙 BlueMoon Apartment Management System

Premium Apartment Management System built with **React (Vite)**, **Node.js (Sequelize)**, and **PostgreSQL**.

---

## ⚡ Quick Start

### 1. Manual Startup (Linux/Mac/WSL)
Open your terminal and run:
```bash
./start.sh
```
*The script will automatically:*
- Detect and kill stale processes on ports 3000, 5000, and 5173.
- Check and install dependencies (Node.js).
- Configure environment variables (`.env`).
- Synchronize the database schema.
- **Seed full sample data** (Residents, Households, Fees, etc.).
- Launch both Backend and Frontend.

### 2. Docker Startup
If you prefer containers:
```bash
./docker-run.sh
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Demo Accounts
All accounts use the default password: `password123`

| Role | Username | Permissions |
| :--- | :--- | :--- |
| **Admin** | `demo_admin` | Full System Access |
| **Accountant** | `demo_ketoan` | Billing, Fee Mgmt, Invoices |
| **Manager** | `demo_totruong` | Resident & Household Mgmt |
| **Resident** | `demo_cudan` | View personal bills & Profile |

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

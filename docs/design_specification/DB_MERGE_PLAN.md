# Database & RBAC Implementation Plan (Target: v2.0)

**VERSION POLICY:** The current system version is **v2.0**. All features previously labeled "v1.0" are now integral parts of the v2.0 baseline. We do not distinguish between legacy and new features; everything is "Current Requirements".

## 1. Demographics & Resident Management
**Goal:** Comprehensive tracking of Households (`HoKhau`), Residents (`NhanKhau`), and their dynamics.

### 1.1 Resident (`Resident.js`)
*   **Fields:**
    *   `full_name` (Ho ten)
    *   `alias` (Bi danh) - **New**
    *   `date_of_birth` (Ngay sinh)
    *   `gender` (Gioi tinh)
    *   `birth_place` (Noi sinh) - **New**
    *   `native_place` (Nguyen quan) - **New**
    *   `ethnicity` (Dan toc)
    *   `religion` (Ton giao) - **New**
    *   `job` (Nghe nghiep)
    *   `workplace` (Noi lam viec) - **New**
    *   `id_card_number` (CCCD/CMND)
    *   `id_card_date` (Ngay cap)
    *   `id_card_place` (Noi cap)
    *   `created_at` (Ngay chuyen den)
    *   `previous_residence` (Dia chi truoc khi chuyen den) - **New**

### 1.2 Household (`Household.js`)
*   **Fields:**
    *   `owner_id` (FK -> Resident) - **Strict Link**
    *   `household_code` (So ho khau)
    *   `address_street` (Duong/Thon)
    *   `address_ward` (Phuong/Xa)
    *   `address_district` (Quan/Huyen)
    *   `created_date` (Ngay lap)

### 1.3 Residency Dynamics (`TemporaryResidence.js`)
*   **New Model:** Tracks both Temporary Residence (`TamTru`) and Temporary Absence (`TamVang`).
*   **Fields:**
    *   `resident_id` (FK)
    *   `type` (Enum: 'TamTru', 'TamVang')
    *   `permit_code` (Ma giay phep)
    *   `start_date` (Tu ngay)
    *   `end_date` (Den ngay)
    *   `reason` (Ly do)

---

## 2. Financial Management (Fees & Contributions)
**Goal:** Manage mandatory monthly fees, vehicles, and voluntary contributions.

### 2.1 Role-Based Access Control (`Role.js`)
*   **Roles:**
    *   `manager` / `admin` (Displays as: "Tổ trưởng/Tổ phó"): Manages People (Demographics) & System.
    *   `accountant` (Displays as: "Kế toán"): Manages Money (Fees, Contributions).

### 2.2 Vehicle Management (`Vehicle.js`)
*   **New Model:** Basis for parking fees.
*   **Fields:** `household_id` (FK), `license_plate` (PK/Unique), `type` (Oto/XeMay), `name`, `color`.

### 2.3 Fee Definitions (`FeeType`, `FeePeriod`)
*   **Mandatory Fees:**
    *   **Sanitation (Ve sinh):** Rules-based (6000 VND * number_of_residents).
    *   **Parking (Gui xe):** Rules-based (70,000/Moto, 1,200,000/Car).
    *   **Utilities (Dien/Nuoc):** Variable input monthly.
*   **Voluntary Contributions (Dong gop):**
    *   Campaign-based (e.g., "Ung ho Teton").
    *   Records specific amount per household.

### 2.4 Invoicing & Payments (`Invoice.js`)
*   **Fields:**
    *   `payment_method` (TienMat, ChuyenKhoan)
    *   `cashier_id` (FK -> User)
    *   `paid_date` (Ngay nop)
    *   `notes` (Ghi chu)

---

## 3. Execution Checklist
1.  **Refactor Models:** `Resident`, `Household`, `Role`.
2.  **Create Models:** `TemporaryResidence`, `Vehicle`.
3.  **Update Fee Logic:** Implement standard prices (6k, 70k, 1.2M) in seeders/logic.

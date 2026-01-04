# Biểu đồ quan hệ dữ liệu (ERD)

Thư mục này chứa các tệp PlantUML mô tả cấu trúc cơ sở dữ liệu của hệ thống, được phân loại theo nhóm chức năng.

## Danh sách biểu đồ

### 1. Kiến trúc hệ thống & Codebase
*   **[High-level System Architecture](./system_architecture.puml)**: Kiến trúc tổng thể hệ thống (Frontend, Backend, Database).
*   **[Backend Structure](./backend_structure.puml)**: Cấu trúc chi tiết các lớp trong Backend (Routes, Middlewares, Controllers, Models).
*   **[Frontend Structure](./frontend_structure.puml)**: Cấu trúc chi tiết các lớp trong Frontend (Pages, Components, Services, Context).

### 2. Biểu đồ quan hệ thực thể (ERD)
*   **[Overview ERD](./overview_erd.puml)**: Tổng quan mối liên hệ giữa tất cả các thực thể trong hệ thống.
*   **[IAM ERD](./iam_erd.puml)**: Quản lý danh tính và quyền truy cập (User, Role, Permission).
*   **[Household ERD](./household_erd.puml)**: Quản lý hộ khẩu, nhân khẩu, tạm trú/tạm vắng và phương tiện.
*   **[Finance ERD](./finance_erd.puml)**: Quản lý các loại phí, đợt thu phí và hóa đơn.

## Cách xem biểu đồ

Bạn có thể sử dụng plugin **PlantUML** trong VS Code hoặc sao chép nội dung tệp `.puml` và dán vào [PlantText](https://www.planttext.com/) hoặc [PlantUML Online Server](https://www.plantuml.com/plantuml/uml/) để xem hình ảnh.

# SDM332 - Hotel Booking System

Website đặt phòng khách sạn dùng HTML, CSS, JavaScript, Node.js, Express, PostgreSQL, Docker Compose và Nginx.

## Chức năng hiện có

- Hiển thị danh sách phòng khách sạn.
- Hiển thị thông tin khách hàng và biểu mẫu đặt phòng.
- Backend cung cấp API và kết nối PostgreSQL.
- Lưu yêu cầu đặt phòng vào bảng `bookings`.
- pgAdmin hỗ trợ quản trị cơ sở dữ liệu.

## Kiến trúc

- `frontend/`: giao diện website.
- `backend/`: API Node.js/Express.
- `database/init.sql`: cấu trúc và dữ liệu khởi tạo.
- `nginx/default.conf`: cấu hình web server và reverse proxy.
- `docker-compose.yml`: các dịch vụ ứng dụng.
- `prometheus/`, `grafana/`, `loki/`, `promtail/`: thư mục dành cho phần giám sát và logging, cần hoàn thiện cấu hình riêng.

## Yêu cầu

- Docker Desktop đang chạy.
- Git.
- Các cổng 8080 và 5051 chưa bị ứng dụng khác chiếm.

## Cài đặt

1. Sao chép repository về máy.
2. Tạo tệp `.env` từ `.env.example`.
3. Thay các giá trị mẫu bằng mật khẩu mạnh, riêng biệt. Không commit `.env`.
4. Tại thư mục dự án, chạy:

   ```powershell
   docker compose up -d --build
   ```

5. Kiểm tra dịch vụ:

   ```powershell
   docker compose ps
   ```

## Truy cập

- Website: http://localhost:8080
- pgAdmin: http://localhost:5051

pgAdmin chỉ được bind vào localhost trên máy chạy Docker.

## Kiểm tra

- Website hiển thị trạng thái kết nối database.
- Có thể truy vấn các bảng `rooms`, `customers`, `bookings` trong PostgreSQL.
- Kiểm tra backend bằng API health endpoint được triển khai trong mã nguồn.

## Bảo mật

- Không đưa `.env`, mật khẩu thật hoặc private key lên GitHub.
- Thay mật khẩu mẫu trong `.env.example` trước khi chạy trên máy mới.
- Không công khai cổng PostgreSQL ra Internet.
- Cấu hình HTTPS, monitoring, centralized logging và các biện pháp hardening sẽ được bổ sung và kiểm thử theo yêu cầu đề tài.

## Môn học

SDM332 - Triển khai và Quản trị Hệ thống Phần mềm.

Đề tài: Hệ thống đặt phòng khách sạn.

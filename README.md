# Hệ thống quản lý bán hàng qua mạng xã hội tích hợp Chatbot AI

Dự án monorepo cho hệ thống quản lý bán hàng, tích hợp OpenAI API để tư vấn khách hàng tự động.

## Cấu trúc thư mục
- `client/`: ReactJS frontend (Vite)
- `server/`: Node.js Express backend (Prisma ORM)

## 1. Cài đặt Server
1. Truy cập thư mục server: `cd server`
2. Cài đặt thư viện: `npm install`
3. Tạo file `.env` từ `.env.example` và cấu hình:
   - `DATABASE_URL`: Đường dẫn MySQL (Local hoặc Cloud)
   - `JWT_SECRET`: Chuỗi bảo mật JWT
   - `OPENAI_API_KEY`: API Key từ OpenAI
4. Khởi tạo Database: `npx prisma migrate dev --name init`
5. Seed dữ liệu mẫu: `npm run prisma:seed`
6. Chạy server (dev mode): `npm run dev`

## 2. Cài đặt Client
1. Truy cập thư mục client: `cd client`
2. Cài đặt thư viện: `npm install`
3. Tạo file `.env` từ `.env.example` và cấu hình:
   - `VITE_API_URL`: URL API server (mặc định http://localhost:5000/api)
4. Chạy frontend: `npm run dev`

## 3. Tài khoản đăng nhập
- Admin: `admin` / `admin123`
- Staff: `staff` / `admin123`

## 4. Chức năng chính
- **Dashboard**: Thống kê doanh thu, đơn hàng, khách hàng.
- **Sản phẩm**: Quản lý kho, giá, danh mục.
- **Khách hàng**: Lưu trữ thông tin và lịch sử mua hàng.
- **Đơn hàng**: Theo dõi và cập nhật trạng thái giao hàng.
- **Chat**: Phản hồi tin nhắn từ khách hàng (Staff).
- **Chatbot AI**: Tự động tư vấn dựa trên danh sách sản phẩm thực tế từ DB.

## 5. Hướng dẫn Deploy
### Backend (Render/Railway)
- Kết nối GitHub repo.
- Cấu hình Root directory là `server`.
- Cấu hình Environment variables như trong file `.env`.
- Build Command: `npm install && npx prisma generate`
- Start Command: `npm start`

### Frontend (Vercel)
- Kết nối GitHub repo.
- Cấu hình Root directory là `client`.
- Cấu hình Environment variables `VITE_API_URL`.
- Framework preset: Vite.

### Database
- Sử dụng Aiven, PlanetScale, hoặc MySQL trên Railway.


ollama pull nomic-embed-text:latest

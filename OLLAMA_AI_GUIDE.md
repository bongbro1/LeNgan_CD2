# Hướng Dẫn Chi Tiết Tích Hợp AI Ollama trong Hệ Thống

Tài liệu này giải thích chi tiết cấu trúc code và cách hoạt động của hệ thống Chatbot AI sử dụng Ollama trong dự án.

---

## 1. Tổng Quan Kiến Trúc
Hệ thống sử dụng **Ollama** làm backend chạy mô hình ngôn ngữ lớn (LLM) tại máy cục bộ (Local). Các thành phần chính bao gồm:
- **LLM Chính**: `qwen2.5:3b` (mặc định) - Dùng để trả lời câu hỏi của khách hàng.
- **Embedding Model**: `nomic-embed-text` - Dùng để tìm kiếm sản phẩm thông minh (Semantic Search).
- **Thư viện kết nối**: `openai` (Node.js SDK) và `LangChain (@langchain/ollama)`.

---

## 2. Chi Tiết Các File Code

### A. Dịch Vụ Cốt Lõi (Services)

#### 1. [aiService.js](file:///d:/Work/DA_ThayKien/LeNgan_DaLam/C%C4%902/server/src/services/aiService.js)
Đây là tầng kết nối thấp nhất (low-level) với Ollama.
- **Chức năng**: Gửi danh sách tin nhắn (`messages`) tới Ollama qua API tương thích với OpenAI.
- **Hàm chính**: `generateReply(messages, config)`
- **Cấu hình**: Mặc định kết nối tới `http://localhost:11434/v1`.

#### 2. [vectorService.js](file:///d:/Work/DA_ThayKien/LeNgan_DaLam/C%C4%902/server/src/services/vectorService.js)
Phụ trách tìm kiếm sản phẩm thông minh (RAG - Retrieval-Augmented Generation).
- **Chức năng**: 
  - Chuyển đổi dữ liệu sản phẩm thành vector (Embedding) bằng model `nomic-embed-text`.
  - Tính toán độ tương đồng Cosine để tìm sản phẩm khớp nhất với nhu cầu khách hàng.
  - **Cơ chế Fallback**: Nếu không có model embedding, hệ thống tự động chuyển sang tìm kiếm theo từ khóa (Keyword Search).
- **Hàm chính**: `searchProducts(query, limit)`

#### 3. [chatbotService.js](file:///d:/Work/DA_ThayKien/LeNgan_DaLam/C%C4%902/server/src/services/chatbotService.js)
Đây là "bộ não" xử lý logic nghiệp vụ của chatbot.
- **Chức năng**:
  - **Nhận diện ý định (Intent Detection)**: Sử dụng Regex để biết khi nào khách hàng đang khai báo vóc dáng (cao, nặng...) hoặc muốn chốt đơn.
  - **Tự động hóa**: Tự động lưu ghi chú khách hàng (`customerNote`) hoặc tạo đơn hàng (`order`) nếu đủ thông tin.
  - **Xây dựng Prompt**: Kết hợp lịch sử chat, thông tin khách hàng và dữ liệu kho hàng thực tế để tạo câu trả lời chính xác nhất.
- **Hàm chính**: `triggerAIReply(conversationId, customerMessage)`

---

### B. Điều Khiển & Điều Phối (Controllers & Routes)

#### 1. [chatbotController.js](file:///d:/Work/DA_ThayKien/LeNgan_DaLam/C%C4%902/server/src/controllers/chatbotController.js)
Xử lý các yêu cầu HTTP từ giao diện Dashboard và Chat Web.
- **`reply`**: Xử lý tin nhắn thực tế từ khách hàng.
- **`simulate`**: Chế độ giả lập (Simulator) để Admin thử nghiệm các kịch bản Prompt khác nhau mà không ảnh hưởng dữ liệu thực.
- **`checkStatus`**: Kiểm tra xem Ollama có đang chạy không và đã tải model chưa.
- **`updateConfigs`**: Lưu các cấu hình như Base URL, Model Name, System Prompt vào Database.

#### 2. [chatbotRoutes.js](file:///d:/Work/DA_ThayKien/LeNgan_DaLam/C%C4%902/server/src/routes/chatbotRoutes.js)
Định nghĩa các API endpoints:
- `POST /api/chatbot/reply`: Chat chính.
- `POST /api/chatbot/simulate`: Chạy giả lập.
- `GET /api/chatbot/status`: Kiểm tra trạng thái AI.
- `GET/POST /api/chatbot/configs`: Quản lý cấu hình AI.

---

## 3. Luồng Hoạt Động (Workflow)

1. **Khách hàng gửi tin nhắn**: Hệ thống nhận tin nhắn qua `chatbotController`.
2. **Tiền xử lý & Tìm kiếm**:
   - `chatbotService` kiểm tra xem tin nhắn có phải là ý định "chốt đơn" hay "khai thông số" không.
   - `vectorService` tìm kiếm các sản phẩm liên quan trong kho hàng.
3. **Thực thi hành động (nếu có)**: Nếu khách nói "chốt mẫu này", hệ thống tự tạo đơn hàng trong DB.
4. **Tạo câu trả lời AI**:
   - Nếu đã thực hiện hành động tự động (tạo đơn/lưu ghi chú), chatbot trả lời xác nhận ngay.
   - Nếu là câu hỏi tư vấn, hệ thống gửi Prompt gồm: *Vai trò (Aura) + Dữ liệu kho + Lịch sử chat* sang Ollama.
5. **Phản hồi**: Lưu câu trả lời của AI vào Database và gửi về cho khách hàng.

---

## 4. Các Model Yêu Cầu
Để hệ thống hoạt động đầy đủ, bạn cần cài đặt Ollama và tải các model sau:

```bash
# Model xử lý ngôn ngữ chính (nhẹ và thông minh)
ollama pull qwen2.5:3b

# Model xử lý tìm kiếm sản phẩm thông minh
ollama pull nomic-embed-text
```

---

## 5. Lưu Ý Quan Trọng
- **Sự thật duy nhất (Ground Truth)**: Chatbot luôn được dặn là chỉ được tư vấn dựa trên "Dữ liệu kho hàng" được cung cấp. Nếu kho hàng báo hết, AI không được tự ý báo còn.
- **Bảo mật**: Các thông tin nhạy cảm của khách hàng (SĐT, Địa chỉ) chỉ được thu thập khi có ý định mua hàng rõ ràng.
- **Kết nối**: Nếu Server không thể kết nối tới port `11434`, hệ thống sẽ báo lỗi yêu cầu kiểm tra Ollama.

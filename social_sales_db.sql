-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 08, 2026 lúc 09:39 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `social_sales_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(26, 'Electronics', 'Gadgets and devices', '2026-05-07 17:41:33.222', '2026-05-07 17:41:33.222'),
(27, 'Fashion', 'Clothing and accessories', '2026-05-07 17:41:33.225', '2026-05-07 17:41:33.225'),
(28, 'Home & Living', 'Furniture and decor', '2026-05-07 17:41:33.228', '2026-05-07 17:41:33.228'),
(29, 'Beauty', 'Cosmetics and skincare', '2026-05-07 17:41:33.231', '2026-05-07 17:41:33.231'),
(30, 'Sports', 'Fitness and outdoor gear', '2026-05-07 17:41:33.233', '2026-05-07 17:41:33.233');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chatbotlog`
--

CREATE TABLE `chatbotlog` (
  `id` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `prompt` text NOT NULL,
  `response` text NOT NULL,
  `tokensUsed` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `channel` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'success'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chatbotlog`
--

INSERT INTO `chatbotlog` (`id`, `conversationId`, `prompt`, `response`, `tokensUsed`, `createdAt`, `channel`, `status`) VALUES
(81, 91, 'Hi, is this available?', 'Yes, it is in stock!', 333, '2026-05-06 17:41:34.336', 'zalo', 'hand-off'),
(82, 92, 'Hi, is this available?', 'Yes, it is in stock!', 230, '2026-05-02 17:41:34.345', 'facebook', 'success'),
(83, 93, 'Hi, is this available?', 'Yes, it is in stock!', 283, '2026-05-02 17:41:34.353', 'zalo', 'success'),
(84, 94, 'Hi, is this available?', 'Yes, it is in stock!', 505, '2026-05-05 17:41:34.360', 'facebook', 'hand-off'),
(85, 95, 'Hi, is this available?', 'Yes, it is in stock!', 349, '2026-05-04 17:41:34.367', 'zalo', 'success'),
(86, 96, 'Hi, is this available?', 'Yes, it is in stock!', 647, '2026-05-03 17:41:34.375', 'facebook', 'success'),
(87, 97, 'Hi, is this available?', 'Yes, it is in stock!', 348, '2026-05-06 17:41:34.385', 'zalo', 'hand-off'),
(88, 98, 'Hi, is this available?', 'Yes, it is in stock!', 160, '2026-05-04 17:41:34.393', 'facebook', 'success'),
(89, 99, 'Hi, is this available?', 'Yes, it is in stock!', 443, '2026-05-03 17:41:34.401', 'zalo', 'success'),
(90, 100, 'Hi, is this available?', 'Yes, it is in stock!', 594, '2026-05-05 17:41:34.410', 'facebook', 'hand-off'),
(91, 101, 'Hi, is this available?', 'Yes, it is in stock!', 513, '2026-05-02 17:41:34.419', 'zalo', 'success'),
(92, 102, 'Hi, is this available?', 'Yes, it is in stock!', 235, '2026-05-06 17:41:34.428', 'facebook', 'success'),
(93, 103, 'Hi, is this available?', 'Yes, it is in stock!', 594, '2026-05-02 17:41:34.436', 'zalo', 'hand-off'),
(94, 104, 'Hi, is this available?', 'Yes, it is in stock!', 375, '2026-05-03 17:41:34.444', 'facebook', 'success'),
(95, 105, 'Hi, is this available?', 'Yes, it is in stock!', 214, '2026-05-05 17:41:34.451', 'zalo', 'success'),
(96, 106, 'Hi, is this available?', 'Yes, it is in stock!', 577, '2026-05-03 17:41:34.459', 'facebook', 'hand-off'),
(97, 107, 'Hi, is this available?', 'Yes, it is in stock!', 213, '2026-05-04 17:41:34.467', 'zalo', 'success'),
(98, 108, 'Hi, is this available?', 'Yes, it is in stock!', 214, '2026-05-02 17:41:34.475', 'facebook', 'success'),
(99, 109, 'Hi, is this available?', 'Yes, it is in stock!', 364, '2026-05-02 17:41:34.483', 'zalo', 'hand-off'),
(100, 110, 'Hi, is this available?', 'Yes, it is in stock!', 366, '2026-05-03 17:41:34.490', 'facebook', 'success'),
(101, 0, 'hi', 'Chào bạn! Tôi sẵn sàng hỗ trợ với các câu hỏi về giá và tồn kho cho sản phẩm. Nếu bạn muốn mua một sản phẩm nào đó, tôi cần biết tên sản phẩm bạn quan tâm để tìm thông tin chính xác. Bạn có thể cung cấp thêm thông tin không?', 4158, '2026-05-08 04:01:23.946', 'simulator', 'success'),
(102, 0, 'hiện nay có bn đơn hàng', 'Xin lỗi, tôi không memiliki thông tin về số lượng đơn hàng hiện tại vì dữ liệu mà tôi được cung cấp chỉ bao gồm danh sách sản phẩm và thông tin của từng sản phẩm như giá và tồn kho. Để biết số lượng đơn hàng, bạn sẽ cần liên hệ với bộ phận quản lý bán hàng hoặc xem trực tiếp trong hệ thống bán hàng của công ty.', 4176, '2026-05-08 04:01:37.599', 'simulator', 'success'),
(103, 0, 'hi', 'Xin chào! Vui lòng cho tôi biết bạn cần thông tin về sản phẩm nào? Tôi sẽ hỗ trợ bạn với giá và tồn kho. Nếu bạn muốn mua hàng, tôi sẽ thu thập thông tin liên lạc của bạn.', 4145, '2026-05-08 04:06:37.219', 'simulator', 'success'),
(104, 0, 'm là ai', 'Xin lỗi, tôi không mememiliki konten tentang individu yang disebut \"m\" dalam pesan Anda. Mohon berikan lebih banyak informasi atau detail, jika mungkin, agar saya bisa membantu dengan sebaiknya.', 4149, '2026-05-08 04:06:46.245', 'simulator', 'success'),
(105, 0, 'mày là ai', 'Tôi là một trợ lý AI được lập trình để hỗ trợ thông tin và giải đáp các thắc mắc của bạn. Tôi có thể giúp bạn tìm hiểu các sản phẩm, đưa ra gợi ý hoặc thậm chí sắp xếp cho bạn nếu cần. Bạn muốn biết thêm về gì?', 4153, '2026-05-08 04:06:58.892', 'simulator', 'success'),
(106, 0, 'hi', 'Chào bạn! Tôi sẽ giúp bạn tìm sản phẩm và thu thập thông tin cho đơn đặt hàng của bạn. Bạn có thể告诉我你要找什么产品吗？', 4130, '2026-05-08 04:18:34.733', 'simulator', 'success'),
(107, 0, 'hi', 'Chào! Tôi có thể giúp gì cho bạn? Hãy cho tôi biết sản phẩm nào bạn quan tâm hoặc cần thông tin về giá và tồn kho. Nếu bạn muốn mua sản phẩm, hãy cung cấp tên, số điện thoại và địa chỉ của bạn. Tôi sẽ thu thập thông tin đó. Bạn có hiểu không?', 4165, '2026-05-08 04:20:58.899', 'simulator', 'success'),
(108, 0, 'ds', 'Tôi đã ghi nhớ danh sách sản phẩm của bạn. Nếu quý khách muốn mua sản phẩm nào đó và cần cung cấp thông tin liên hệ như tên, số điện thoại và địa chỉ, hãy cho tôi biết. Tôi sẽ thu thập những thông tin đó một cách lịch sự và sau đó chuyển giao cuộc trò chuyện cho nhân viên phụ trách để họ có thể hỗ trợ quý khách tốt hơn.', 4180, '2026-05-08 04:22:48.950', 'simulator', 'success'),
(109, 0, 'a', 'Xin chào! Dựa trên dữ liệu mà bạn đã cung cấp, tôi sẽ lấy thông tin sản phẩm từ đầu danh sách. Ví dụ, nếu bạn muốn biết thông tin về sản phẩm có ID là 1: Giá của nó là 483845 VND và tồn kho là 3 bộ. Để được hỗ trợ thêm hoặc mua hàng, xin vui lòng cung cấp tên, số điện thoại và địa chỉ giao hàng của bạn. Nếu yêu cầu gặp nhân viên hỗ trợ, hãy liên hệ lại!', 4211, '2026-05-08 04:23:09.276', 'simulator', 'success'),
(110, 0, 'd', 'Xin vui lòng cung cấp thông tin về sản phẩm bạn quan tâm để tôi tìm giá và tồn kho của nó. Nếu quý khách muốn mua, hãy cho tôi biết tên, số điện thoại và địa chỉ giao hàng.', 4147, '2026-05-08 04:23:27.936', 'simulator', 'success'),
(111, 0, 'hiện có bao nhiêu đơn hàng', 'Dữ liệu mà tôi được cung cấp không chứa thông tin về số lượng đơn hàng. Bạn cần phải kiểm tra thông tin này từ hệ thống quản lý bán hàng hoặc kho của bạn.', 4136, '2026-05-08 04:23:40.544', 'simulator', 'success'),
(112, 0, 'm có thể trả lời những câu như nào', 'Bạn có thể hỏi về giá sản phẩm cụ thể, số lượng tồn kho, hoặc thông tin chi tiết về bất kỳ sản phẩm nào trong danh sách. Tôi sẽ hỗ trợ bạn bằng cách cung cấp thông tin dựa trên dữ liệu được cung cấp. Nếu bạn muốn mua sản phẩm, tôi sẽ chỉ cho bạn biết tên, số điện thoại và địa chỉ để thu thập thông tin liên lạc cần thiết.', 4182, '2026-05-08 04:23:55.144', 'simulator', 'success'),
(113, 0, 'hiện có bao nhiêu sản phẩm', 'Hiện tại có 100 sản phẩm trong danh sách. Bạn cần thông tin về giá và tồn kho của chúng không?', 4124, '2026-05-08 04:24:12.752', 'simulator', 'success'),
(114, 0, 'list ra đi', 'Đây là danh sách các sản phẩm cùng với giá và tồn kho:\n\n1. Sản phẩm 1: Giá - Số lượng trong kho (Lưu trong dữ liệu gốc)\n2. Sản phẩm 2: Giá - Số lượng trong kho (Lưu trong dữ liệu gốc)\n...\n100. Sản phẩm 100: Giá - Số lượng trong kho (Lưu trong dữ liệu gốc)\n\nNếu bạn muốn biết giá và tồn kho cụ thể của một sản phẩm nào đó, vui lòng cung cấp ID hoặc tên sản phẩm. Tôi sẽ giúp bạn tìm thông tin chính xác.', 4220, '2026-05-08 04:24:27.783', 'simulator', 'success'),
(115, 0, 'sản phẩm 1 tên gì', 'Sản phẩm thứ 1 không có thông tin về tên sản phẩm trong dữ liệu bạn cung cấp.', 4119, '2026-05-08 04:24:46.264', 'simulator', 'success'),
(116, 0, 'Product 100 có giá bao nhiêu', 'Sản phẩm thứ 100 của bạn có giá là 483845 VND và tồn kho còn lại là 3 unidades.', 4129, '2026-05-08 04:25:06.201', 'simulator', 'success'),
(117, 0, 'hi', 'Chào bạn! Tôi sẵn lòng hỗ trợ bạn với thông tin về sản phẩm. Bạn muốn tìm hiểu thông tin về sản phẩm nào? Hoặc nếu đã sẵn sàng mua hàng, tôi sẽ thu thập thông tin liên hệ của bạn: tên, số điện thoại và địa chỉ. Hãy cho tôi biết nhé!', 4161, '2026-05-08 05:44:42.259', 'simulator', 'success'),
(118, 0, 'd', 'Xin vui lòng cung cấp thông tin về sản phẩm bạn quan tâm để tôi tìm kiếm giá và tồn kho cho bạn. Nếu bạn muốn mua ngay lập tức, hãy cung cấp tên, số điện thoại và địa chỉ của bạn. Bạn có thể cho我知道你想要购买什么产品吗？', 4162, '2026-05-08 05:44:49.889', 'simulator', 'success'),
(119, 97, 'd', 'Xin vui lòng cung cấp thông tin về sản phẩm bạn quan tâm, bao gồm tên, số điện thoại và địa chỉ để chúng tôi có thể thu thập thông tin đó. Chúng tôi sẽ giúp bạn tìm sản phẩm với giá tốt nhất và sẵn sàng hỗ trợ trực tiếp nếu cần.', 4159, '2026-05-08 06:21:10.690', 'zalo', 'success'),
(120, 97, 'ssss', 'Xin lỗi, tôi không hiểu ý bạn muốn nói là gì. Bạn cần giúp với thông tin về sản phẩm hay có nhu cầu mua sắm nào không? Tôi sẽ cố gắng hỗ trợ một cách tốt nhất possible.', 4143, '2026-05-08 06:21:13.241', 'zalo', 'success'),
(121, 97, 'ssss', 'Xin lỗi, bạn đã gõ sai cú pháp. Bạn muốn biết thông tin về sản phẩm hay có nhu cầu mua sắm gì đó không? Nếu có nhu cầu mua sắm, tôi cần tên sản phẩm, số điện thoại và địa chỉ để hỗ trợ bạn thêm nhé.', 4157, '2026-05-08 06:31:15.229', 'zalo', 'success'),
(122, 97, 'ssss', 'Xin lỗi, tôi không hiểu thông điệp của bạn. Bạn muốn biết giá sản phẩm nào? Hay hỏi về tồn kho? 或者你想购买什么产品？请提供产品的名称、联系方式（电话）、地址，我会根据你提供的信息给出帮助。', 4150, '2026-05-08 06:31:17.842', 'zalo', 'success'),
(123, 97, 'alo', 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay? Dựa trên dữ liệu sản phẩm tôi đã được cung cấp, tôi có thể đưa ra thông tin về giá và tồn kho của các sản phẩm. Nếu bạn có ý định mua hàng, hãy cho tôi biết tên, số điện thoại và địa chỉ của bạn để chúng tôi có thể hoàn tất giao dịch một cách tốt nhất.', 4181, '2026-05-08 06:31:32.448', 'zalo', 'success'),
(124, 97, 'd', 'Chắc chắn, tôi sẽ hỗ trợ bạn về thông tin sản phẩm. Nếu bạn muốn mua một sản phẩm nào đó, vui lòng cung cấp tên sản phẩm và thông tin liên lạc như số điện thoại và địa chỉ để chúng tôi có thể xử lý tiếp theo. Bạn có cần giúp đỡ ngay bây giờ không?', 4166, '2026-05-08 06:34:25.869', 'zalo', 'success'),
(125, 97, 'alo', 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay không? Hãy cho tôi biết tên sản phẩm, số điện thoại và địa chỉ của bạn nếu muốn mua hàng. Nếu cần gặp nhân viên hỗ trợ, hãy thông báo cho tôi biết.', 4150, '2026-05-08 06:34:39.947', 'zalo', 'success'),
(126, 97, 'm là ai', 'Xin lỗi đã gây hiểu lầm, tôi cần thông tin về sản phẩm cụ thể bạn muốn biết chứ không phải người tên m là ai. Bạn có thể cung cấp thông tin chi tiết hơn để tôi giúp đỡ? Tôi sẵn lòng thu thập thông tin khách hàng nếu họ muốn mua sản phẩm.', 4160, '2026-05-08 06:34:54.201', 'zalo', 'success'),
(127, 97, 'alo', 'Xin chào! Tôi có thể giúp gì cho bạn? Hãy cho tôi biết sản phẩm nào bạn quan tâm hoặc cần thông tin về tồn kho và giá cả. Nếu bạn muốn mua hàng, hãy cung cấp tên, số điện thoại và địa chỉ, tôi sẽ thu thập thông tin đó. Còn nếu bạn muốn tìm hiểu thêm về các sản phẩm, vui lòng cho tôi biết cụ thể.', 4180, '2026-05-08 06:35:52.523', 'zalo', 'success'),
(128, 97, 'heheh', 'Xin chào! Tôi là trợ lý của bạn. Nếu bạn muốn biết thông tin về các sản phẩm, giá cả và tồn kho như nào thì hãy cho tôi biết mã sản phẩm cụ thể hoặc chỉ ra danh mục mà bạn quan tâm nhé. Hoặc nếu bạn muốn mua sản phẩm, vui lòng cung cấp cho tôi tên, số điện thoại và địa chỉ của bạn để chúng tôi có thể liên lạc lại. Hãy cho tôi biết nhu cầu của bạn nào!', 4195, '2026-05-08 06:36:06.530', 'zalo', 'success'),
(129, 97, 't muốn mua hàng', 'Chào bạn! Tôi có thể giúp gì cho bạn hôm nay? Bạn muốn mua sản phẩm nào trong danh sách tôi đã cung cấp? Hãy告知我你的选择, giá và tồn kho của sản phẩm đó để tôi có thể cập nhật thông tin chính xác. Sau khi nhận được thông tin từ bạn, tôi sẽ thu thập thêm thông tin liên lạc như số điện thoại và địa chỉ của bạn nếu cần thiết.', 4184, '2026-05-08 06:36:20.314', 'zalo', 'success'),
(130, 97, 'alo', 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay? Hãy cho tôi biết tên sản phẩm bạn quan tâm, số điện thoại và địa chỉ điạ để chúng tôi hỗ trợ tốt hơn. Nếu bạn muốn mua ngay, vui lòng cung cấp thông tin cá nhân đó.', 4160, '2026-05-08 06:37:28.669', 'zalo', 'success'),
(131, 97, 't muốn tư vấn về sản phẩm loại Sports', 'Xin chào! Để tư vấn sản phẩm tốt hơn, tôi cần biết cụ thể hơn về loại sản phẩm Thể thao nào bạn quan tâm như dép chạy bộ, quần áo tập gym hay các thiết bị khác? Đây chỉ mới là thông tin chung tổng quát về thể thao.', 4158, '2026-05-08 06:37:42.048', 'zalo', 'success'),
(132, 97, 'quần áo thể thao', 'Chúng tôi không có thông tin về sản phẩm cụ thể là \"quần áo thể thao\".烦请您提供更具体的信息，例如产品编号或详细描述，我才能帮您查找相关信息。如果您有兴趣购买任何产品，请告诉我您的姓名、联系电话和送达地址，我会立即记录下来以便后续处理。', 4162, '2026-05-08 06:38:01.159', 'zalo', 'success'),
(133, 97, 'quần tập gym', 'Xin lỗi tôi không thấy thông tin cụ thể về sản phẩm quần tập gym trong dữ liệu được cung cấp. Để hỗ trợ bạn tốt hơn, nếu có thể xin hãy cung cấp thêm chi tiết về mẫu, size hay bất kỳ yêu cầu nào khác nhé! Tôi sẽ rất vui lòng giúp đỡ khi có đủ thông tin.', 4167, '2026-05-08 06:38:15.229', 'zalo', 'success'),
(134, 97, 't muốn biết giá của Product 110', 'Dạ tôi xin lỗi, nhưng thông tin về sản phẩm có mã số \"Product 110\" không được tìm thấy trong danh sách mà chúng tôi cung cấp. Vui lòng kiểm tra lại tên sản phẩm hoặc danh mục bạn đang quan tâm để chắc chắn rằng nó tồn tại trong cơ sở dữ liệu của chúng tôi. Nếu đó là một lỗi kỹ thuật, tôi sẽ báo cáo vấn đề này ngay lập tức.', 4187, '2026-05-08 06:39:54.860', 'zalo', 'success'),
(135, 97, 't muốn biết giá của Product 100', 'Dạ bên em có Product 100 thuộc dòng beauty. Giá sản phẩm này là 483.845 đồng. Nếu bạn quan tâm đến thông tin thêm về sản phẩm này?', 4140, '2026-05-08 06:40:03.748', 'zalo', 'success'),
(136, 97, 'có khuyến mãi k', 'Tôi sẽ giúp bạn kiểm tra các sản phẩm trong danh sách để xem có khuyến mãi nào không. Bạn muốn biết về loại sản phẩm nào cụ thể? Ví dụ: đồ thể thao, đồ dùng nhà bếp hay mỹ phẩm?', 4146, '2026-05-08 06:40:22.870', 'zalo', 'success');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversation`
--

CREATE TABLE `conversation` (
  `id` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `lastMessage` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `isTyping` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `conversation`
--

INSERT INTO `conversation` (`id`, `customerId`, `lastMessage`, `createdAt`, `updatedAt`, `isTyping`) VALUES
(92, 503, 'I need help with my order.', '2026-05-07 17:41:34.346', '2026-05-02 17:41:34.345', 0),
(93, 504, 'I need help with my order.', '2026-05-07 17:41:34.353', '2026-05-02 17:41:34.353', 0),
(94, 505, 'I need help with my order.', '2026-05-07 17:41:34.361', '2026-05-05 17:41:34.360', 0),
(95, 506, 'I need help with my order.', '2026-05-07 17:41:34.368', '2026-05-04 17:41:34.367', 0),
(96, 507, 'I need help with my order.', '2026-05-07 17:41:34.376', '2026-05-03 17:41:34.375', 0),
(97, 508, 'Xin chào! Tôi có thể tư vấn cho bạn một số kiến thức cơ bản hoặc gợi ý các sản phẩm phù hợp dựa trên những thông tin mà bạn cung cấp. Bạn muốn tìm hiểu về điều gì hay đang quan tâm đến sản phẩm nào không?', '2026-05-07 17:41:34.386', '2026-05-08 07:11:20.168', 0),
(98, 509, 'I need help with my order.', '2026-05-07 17:41:34.394', '2026-05-04 17:41:34.393', 0),
(99, 510, 'I need help with my order.', '2026-05-07 17:41:34.402', '2026-05-03 17:41:34.401', 0),
(100, 511, 'I need help with my order.', '2026-05-07 17:41:34.411', '2026-05-05 17:41:34.410', 0),
(101, 512, 'I need help with my order.', '2026-05-07 17:41:34.420', '2026-05-02 17:41:34.419', 0),
(102, 513, 'I need help with my order.', '2026-05-07 17:41:34.429', '2026-05-08 03:13:33.482', 0),
(103, 514, 'I need help with my order.', '2026-05-07 17:41:34.437', '2026-05-02 17:41:34.436', 0),
(104, 515, 'I need help with my order.', '2026-05-07 17:41:34.445', '2026-05-03 17:41:34.444', 0),
(105, 516, 'I need help with my order.', '2026-05-07 17:41:34.452', '2026-05-05 17:41:34.451', 0),
(106, 517, 'I need help with my order.', '2026-05-07 17:41:34.460', '2026-05-03 17:41:34.459', 0),
(107, 518, 'I need help with my order.', '2026-05-07 17:41:34.468', '2026-05-04 17:41:34.467', 0),
(108, 519, 'I need help with my order.', '2026-05-07 17:41:34.476', '2026-05-02 17:41:34.475', 0),
(109, 520, 'I need help with my order.', '2026-05-07 17:41:34.484', '2026-05-02 17:41:34.483', 0),
(110, 521, 'I need help with my order.', '2026-05-07 17:41:34.491', '2026-05-03 17:41:34.490', 0),
(112, 601, 'Tôi hiểu bạn cảm thấy không hài lòng, nhưng tôi cần giữ sự chuyên nghiệp trong mỗi cuộc trò chuyện để có thể hỗ trợ bạn tốt hơn. Hãy cho tôi biết cụ thể là gì bạn muốn thảo luận hoặc vấn đề nào bạn đang gặp phải, và tôi sẽ cố gắng giúp bạn một cách cẩn thận và kịp thời nhất.', '2026-05-08 07:04:46.182', '2026-05-08 07:10:28.112', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `socialPlatform` varchar(191) DEFAULT NULL,
  `socialId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `rank` varchar(191) NOT NULL DEFAULT 'SILVER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `customer`
--

INSERT INTO `customer` (`id`, `fullName`, `phone`, `email`, `address`, `socialPlatform`, `socialId`, `createdAt`, `updatedAt`, `rank`) VALUES
(502, 'Customer 1', '0909234993', 'customer1@example.com', '1 Le Loi St, District 1, HCMC', 'zalo', 'social_1', '2026-05-07 17:41:33.500', '2026-05-07 17:41:33.500', 'SILVER'),
(503, 'Customer 2', '0900551204', 'customer2@example.com', '2 Le Loi St, District 1, HCMC', 'facebook', 'social_2', '2026-05-07 17:41:33.503', '2026-05-07 17:41:33.503', 'SILVER'),
(504, 'Customer 3', '0900003653', 'customer3@example.com', '3 Le Loi St, District 1, HCMC', 'zalo', 'social_3', '2026-05-07 17:41:33.505', '2026-05-07 17:41:33.505', 'SILVER'),
(505, 'Customer 4', '0907843776', 'customer4@example.com', '4 Le Loi St, District 1, HCMC', 'facebook', 'social_4', '2026-05-07 17:41:33.508', '2026-05-07 17:41:33.508', 'SILVER'),
(506, 'Customer 5', '0909024397', 'customer5@example.com', '5 Le Loi St, District 1, HCMC', 'zalo', 'social_5', '2026-05-07 17:41:33.510', '2026-05-07 17:41:33.510', 'SILVER'),
(507, 'Customer 6', '0900206809', 'customer6@example.com', '6 Le Loi St, District 1, HCMC', 'facebook', 'social_6', '2026-05-07 17:41:33.512', '2026-05-07 17:41:33.512', 'SILVER'),
(508, 'Customer 7', '0903262573', 'customer7@example.com', '7 Le Loi St, District 1, HCMC', 'zalo', 'social_7', '2026-05-07 17:41:33.515', '2026-05-07 17:41:33.515', 'SILVER'),
(509, 'Customer 8', '0902814034', 'customer8@example.com', '8 Le Loi St, District 1, HCMC', 'facebook', 'social_8', '2026-05-07 17:41:33.518', '2026-05-07 17:41:33.518', 'SILVER'),
(510, 'Customer 9', '0908608689', 'customer9@example.com', '9 Le Loi St, District 1, HCMC', 'zalo', 'social_9', '2026-05-07 17:41:33.520', '2026-05-07 17:41:33.520', 'SILVER'),
(511, 'Customer 10', '0905977808', 'customer10@example.com', '10 Le Loi St, District 1, HCMC', 'facebook', 'social_10', '2026-05-07 17:41:33.523', '2026-05-07 17:41:33.523', 'SILVER'),
(512, 'Customer 11', '0907732982', 'customer11@example.com', '11 Le Loi St, District 1, HCMC', 'zalo', 'social_11', '2026-05-07 17:41:33.525', '2026-05-07 17:41:33.525', 'SILVER'),
(513, 'Customer 12', '0904270274', 'customer12@example.com', '12 Le Loi St, District 1, HCMC', 'facebook', 'social_12', '2026-05-07 17:41:33.528', '2026-05-07 17:41:33.528', 'SILVER'),
(514, 'Customer 13', '0902157687', 'customer13@example.com', '13 Le Loi St, District 1, HCMC', 'zalo', 'social_13', '2026-05-07 17:41:33.530', '2026-05-07 17:41:33.530', 'SILVER'),
(515, 'Customer 14', '0909322526', 'customer14@example.com', '14 Le Loi St, District 1, HCMC', 'facebook', 'social_14', '2026-05-07 17:41:33.533', '2026-05-07 17:41:33.533', 'SILVER'),
(516, 'Customer 15', '0903642882', 'customer15@example.com', '15 Le Loi St, District 1, HCMC', 'zalo', 'social_15', '2026-05-07 17:41:33.535', '2026-05-07 17:41:33.535', 'SILVER'),
(517, 'Customer 16', '0906533575', 'customer16@example.com', '16 Le Loi St, District 1, HCMC', 'facebook', 'social_16', '2026-05-07 17:41:33.538', '2026-05-07 17:41:33.538', 'SILVER'),
(518, 'Customer 17', '0908921072', 'customer17@example.com', '17 Le Loi St, District 1, HCMC', 'zalo', 'social_17', '2026-05-07 17:41:33.540', '2026-05-07 17:41:33.540', 'SILVER'),
(519, 'Customer 18', '0907151969', 'customer18@example.com', '18 Le Loi St, District 1, HCMC', 'facebook', 'social_18', '2026-05-07 17:41:33.543', '2026-05-07 17:41:33.543', 'SILVER'),
(520, 'Customer 19', '0903279815', 'customer19@example.com', '19 Le Loi St, District 1, HCMC', 'zalo', 'social_19', '2026-05-07 17:41:33.545', '2026-05-07 17:41:33.545', 'SILVER'),
(521, 'Customer 20', '0901525706', 'customer20@example.com', '20 Le Loi St, District 1, HCMC', 'facebook', 'social_20', '2026-05-07 17:41:33.548', '2026-05-07 17:41:33.548', 'SILVER'),
(522, 'Customer 21', '0906978061', 'customer21@example.com', '21 Le Loi St, District 1, HCMC', 'zalo', 'social_21', '2026-05-07 17:41:33.550', '2026-05-07 17:41:33.550', 'SILVER'),
(523, 'Customer 22', '0905573162', 'customer22@example.com', '22 Le Loi St, District 1, HCMC', 'facebook', 'social_22', '2026-05-07 17:41:33.553', '2026-05-07 17:41:33.553', 'SILVER'),
(524, 'Customer 23', '0906545978', 'customer23@example.com', '23 Le Loi St, District 1, HCMC', 'zalo', 'social_23', '2026-05-07 17:41:33.555', '2026-05-07 17:41:33.555', 'SILVER'),
(525, 'Customer 24', '0900815676', 'customer24@example.com', '24 Le Loi St, District 1, HCMC', 'facebook', 'social_24', '2026-05-07 17:41:33.558', '2026-05-07 17:41:33.558', 'SILVER'),
(526, 'Customer 25', '0909333539', 'customer25@example.com', '25 Le Loi St, District 1, HCMC', 'zalo', 'social_25', '2026-05-07 17:41:33.560', '2026-05-07 17:41:33.560', 'SILVER'),
(527, 'Customer 26', '0903739450', 'customer26@example.com', '26 Le Loi St, District 1, HCMC', 'facebook', 'social_26', '2026-05-07 17:41:33.562', '2026-05-07 17:41:33.562', 'SILVER'),
(528, 'Customer 27', '0908994220', 'customer27@example.com', '27 Le Loi St, District 1, HCMC', 'zalo', 'social_27', '2026-05-07 17:41:33.565', '2026-05-07 17:41:33.565', 'SILVER'),
(529, 'Customer 28', '0908278524', 'customer28@example.com', '28 Le Loi St, District 1, HCMC', 'facebook', 'social_28', '2026-05-07 17:41:33.567', '2026-05-07 17:41:33.567', 'SILVER'),
(530, 'Customer 29', '0904207908', 'customer29@example.com', '29 Le Loi St, District 1, HCMC', 'zalo', 'social_29', '2026-05-07 17:41:33.570', '2026-05-07 17:41:33.570', 'SILVER'),
(531, 'Customer 30', '0903866718', 'customer30@example.com', '30 Le Loi St, District 1, HCMC', 'facebook', 'social_30', '2026-05-07 17:41:33.572', '2026-05-07 17:41:33.572', 'SILVER'),
(532, 'Customer 31', '0905860180', 'customer31@example.com', '31 Le Loi St, District 1, HCMC', 'zalo', 'social_31', '2026-05-07 17:41:33.581', '2026-05-07 17:41:33.581', 'SILVER'),
(533, 'Customer 32', '0900370818', 'customer32@example.com', '32 Le Loi St, District 1, HCMC', 'facebook', 'social_32', '2026-05-07 17:41:33.583', '2026-05-07 17:41:33.583', 'SILVER'),
(534, 'Customer 33', '0906498086', 'customer33@example.com', '33 Le Loi St, District 1, HCMC', 'zalo', 'social_33', '2026-05-07 17:41:33.586', '2026-05-07 17:41:33.586', 'SILVER'),
(535, 'Customer 34', '0900056463', 'customer34@example.com', '34 Le Loi St, District 1, HCMC', 'facebook', 'social_34', '2026-05-07 17:41:33.589', '2026-05-07 17:41:33.589', 'SILVER'),
(536, 'Customer 35', '0901978644', 'customer35@example.com', '35 Le Loi St, District 1, HCMC', 'zalo', 'social_35', '2026-05-07 17:41:33.591', '2026-05-07 17:41:33.591', 'SILVER'),
(537, 'Customer 36', '0902803024', 'customer36@example.com', '36 Le Loi St, District 1, HCMC', 'facebook', 'social_36', '2026-05-07 17:41:33.594', '2026-05-07 17:41:33.594', 'SILVER'),
(538, 'Customer 37', '0909140505', 'customer37@example.com', '37 Le Loi St, District 1, HCMC', 'zalo', 'social_37', '2026-05-07 17:41:33.597', '2026-05-07 17:41:33.597', 'SILVER'),
(539, 'Customer 38', '0907030754', 'customer38@example.com', '38 Le Loi St, District 1, HCMC', 'facebook', 'social_38', '2026-05-07 17:41:33.600', '2026-05-07 17:41:33.600', 'SILVER'),
(540, 'Customer 39', '0909427659', 'customer39@example.com', '39 Le Loi St, District 1, HCMC', 'zalo', 'social_39', '2026-05-07 17:41:33.602', '2026-05-07 17:41:33.602', 'SILVER'),
(541, 'Customer 40', '0903674906', 'customer40@example.com', '40 Le Loi St, District 1, HCMC', 'facebook', 'social_40', '2026-05-07 17:41:33.604', '2026-05-07 17:41:33.604', 'SILVER'),
(542, 'Customer 41', '0901296307', 'customer41@example.com', '41 Le Loi St, District 1, HCMC', 'zalo', 'social_41', '2026-05-07 17:41:33.607', '2026-05-07 17:41:33.607', 'SILVER'),
(543, 'Customer 42', '0901195042', 'customer42@example.com', '42 Le Loi St, District 1, HCMC', 'facebook', 'social_42', '2026-05-07 17:41:33.609', '2026-05-07 17:41:33.609', 'SILVER'),
(544, 'Customer 43', '0901454875', 'customer43@example.com', '43 Le Loi St, District 1, HCMC', 'zalo', 'social_43', '2026-05-07 17:41:33.611', '2026-05-07 17:41:33.611', 'SILVER'),
(545, 'Customer 44', '0902229714', 'customer44@example.com', '44 Le Loi St, District 1, HCMC', 'facebook', 'social_44', '2026-05-07 17:41:33.614', '2026-05-07 17:41:33.614', 'SILVER'),
(546, 'Customer 45', '0903781359', 'customer45@example.com', '45 Le Loi St, District 1, HCMC', 'zalo', 'social_45', '2026-05-07 17:41:33.616', '2026-05-07 17:41:33.616', 'SILVER'),
(547, 'Customer 46', '0909244414', 'customer46@example.com', '46 Le Loi St, District 1, HCMC', 'facebook', 'social_46', '2026-05-07 17:41:33.619', '2026-05-07 17:41:33.619', 'SILVER'),
(548, 'Customer 47', '0908141773', 'customer47@example.com', '47 Le Loi St, District 1, HCMC', 'zalo', 'social_47', '2026-05-07 17:41:33.621', '2026-05-07 17:41:33.621', 'SILVER'),
(549, 'Customer 48', '0905794936', 'customer48@example.com', '48 Le Loi St, District 1, HCMC', 'facebook', 'social_48', '2026-05-07 17:41:33.623', '2026-05-07 17:41:33.623', 'SILVER'),
(550, 'Customer 49', '0905073786', 'customer49@example.com', '49 Le Loi St, District 1, HCMC', 'zalo', 'social_49', '2026-05-07 17:41:33.626', '2026-05-07 17:41:33.626', 'SILVER'),
(551, 'Customer 50', '0906481178', 'customer50@example.com', '50 Le Loi St, District 1, HCMC', 'facebook', 'social_50', '2026-05-07 17:41:33.628', '2026-05-07 17:41:33.628', 'SILVER'),
(552, 'Customer 51', '0908531470', 'customer51@example.com', '51 Le Loi St, District 1, HCMC', 'zalo', 'social_51', '2026-05-07 17:41:33.631', '2026-05-07 17:41:33.631', 'SILVER'),
(553, 'Customer 52', '0901021458', 'customer52@example.com', '52 Le Loi St, District 1, HCMC', 'facebook', 'social_52', '2026-05-07 17:41:33.634', '2026-05-07 17:41:33.634', 'SILVER'),
(554, 'Customer 53', '0905703397', 'customer53@example.com', '53 Le Loi St, District 1, HCMC', 'zalo', 'social_53', '2026-05-07 17:41:33.637', '2026-05-07 17:41:33.637', 'SILVER'),
(555, 'Customer 54', '0902134782', 'customer54@example.com', '54 Le Loi St, District 1, HCMC', 'facebook', 'social_54', '2026-05-07 17:41:33.639', '2026-05-07 17:41:33.639', 'SILVER'),
(556, 'Customer 55', '0909226203', 'customer55@example.com', '55 Le Loi St, District 1, HCMC', 'zalo', 'social_55', '2026-05-07 17:41:33.641', '2026-05-07 17:41:33.641', 'SILVER'),
(557, 'Customer 56', '0905128440', 'customer56@example.com', '56 Le Loi St, District 1, HCMC', 'facebook', 'social_56', '2026-05-07 17:41:33.644', '2026-05-07 17:41:33.644', 'SILVER'),
(558, 'Customer 57', '0901053009', 'customer57@example.com', '57 Le Loi St, District 1, HCMC', 'zalo', 'social_57', '2026-05-07 17:41:33.646', '2026-05-07 17:41:33.646', 'SILVER'),
(559, 'Customer 58', '0904001681', 'customer58@example.com', '58 Le Loi St, District 1, HCMC', 'facebook', 'social_58', '2026-05-07 17:41:33.648', '2026-05-07 17:41:33.648', 'SILVER'),
(560, 'Customer 59', '0905910627', 'customer59@example.com', '59 Le Loi St, District 1, HCMC', 'zalo', 'social_59', '2026-05-07 17:41:33.650', '2026-05-07 17:41:33.650', 'SILVER'),
(561, 'Customer 60', '0901338619', 'customer60@example.com', '60 Le Loi St, District 1, HCMC', 'facebook', 'social_60', '2026-05-07 17:41:33.652', '2026-05-07 17:41:33.652', 'SILVER'),
(562, 'Customer 61', '0909319434', 'customer61@example.com', '61 Le Loi St, District 1, HCMC', 'zalo', 'social_61', '2026-05-07 17:41:33.655', '2026-05-07 17:41:33.655', 'SILVER'),
(563, 'Customer 62', '0903884813', 'customer62@example.com', '62 Le Loi St, District 1, HCMC', 'facebook', 'social_62', '2026-05-07 17:41:33.657', '2026-05-07 17:41:33.657', 'SILVER'),
(564, 'Customer 63', '0900309858', 'customer63@example.com', '63 Le Loi St, District 1, HCMC', 'zalo', 'social_63', '2026-05-07 17:41:33.659', '2026-05-07 17:41:33.659', 'SILVER'),
(565, 'Customer 64', '0909657364', 'customer64@example.com', '64 Le Loi St, District 1, HCMC', 'facebook', 'social_64', '2026-05-07 17:41:33.667', '2026-05-07 17:41:33.667', 'SILVER'),
(566, 'Customer 65', '0908595912', 'customer65@example.com', '65 Le Loi St, District 1, HCMC', 'zalo', 'social_65', '2026-05-07 17:41:33.670', '2026-05-07 17:41:33.670', 'SILVER'),
(567, 'Customer 66', '0904875324', 'customer66@example.com', '66 Le Loi St, District 1, HCMC', 'facebook', 'social_66', '2026-05-07 17:41:33.672', '2026-05-07 17:41:33.672', 'SILVER'),
(568, 'Customer 67', '0901621035', 'customer67@example.com', '67 Le Loi St, District 1, HCMC', 'zalo', 'social_67', '2026-05-07 17:41:33.675', '2026-05-07 17:41:33.675', 'SILVER'),
(569, 'Customer 68', '0901857325', 'customer68@example.com', '68 Le Loi St, District 1, HCMC', 'facebook', 'social_68', '2026-05-07 17:41:33.677', '2026-05-07 17:41:33.677', 'SILVER'),
(570, 'Customer 69', '0902680384', 'customer69@example.com', '69 Le Loi St, District 1, HCMC', 'zalo', 'social_69', '2026-05-07 17:41:33.679', '2026-05-07 17:41:33.679', 'SILVER'),
(571, 'Customer 70', '0908807318', 'customer70@example.com', '70 Le Loi St, District 1, HCMC', 'facebook', 'social_70', '2026-05-07 17:41:33.682', '2026-05-07 17:41:33.682', 'SILVER'),
(572, 'Customer 71', '0907198363', 'customer71@example.com', '71 Le Loi St, District 1, HCMC', 'zalo', 'social_71', '2026-05-07 17:41:33.684', '2026-05-07 17:41:33.684', 'SILVER'),
(573, 'Customer 72', '0902534678', 'customer72@example.com', '72 Le Loi St, District 1, HCMC', 'facebook', 'social_72', '2026-05-07 17:41:33.687', '2026-05-07 17:41:33.687', 'SILVER'),
(574, 'Customer 73', '0906280346', 'customer73@example.com', '73 Le Loi St, District 1, HCMC', 'zalo', 'social_73', '2026-05-07 17:41:33.689', '2026-05-07 17:41:33.689', 'SILVER'),
(575, 'Customer 74', '0901599609', 'customer74@example.com', '74 Le Loi St, District 1, HCMC', 'facebook', 'social_74', '2026-05-07 17:41:33.691', '2026-05-07 17:41:33.691', 'SILVER'),
(576, 'Customer 75', '0909492521', 'customer75@example.com', '75 Le Loi St, District 1, HCMC', 'zalo', 'social_75', '2026-05-07 17:41:33.693', '2026-05-07 17:41:33.693', 'SILVER'),
(577, 'Customer 76', '0905159378', 'customer76@example.com', '76 Le Loi St, District 1, HCMC', 'facebook', 'social_76', '2026-05-07 17:41:33.695', '2026-05-07 17:41:33.695', 'SILVER'),
(578, 'Customer 77', '0901107050', 'customer77@example.com', '77 Le Loi St, District 1, HCMC', 'zalo', 'social_77', '2026-05-07 17:41:33.698', '2026-05-07 17:41:33.698', 'SILVER'),
(579, 'Customer 78', '0904521236', 'customer78@example.com', '78 Le Loi St, District 1, HCMC', 'facebook', 'social_78', '2026-05-07 17:41:33.700', '2026-05-07 17:41:33.700', 'SILVER'),
(580, 'Customer 79', '0905871417', 'customer79@example.com', '79 Le Loi St, District 1, HCMC', 'zalo', 'social_79', '2026-05-07 17:41:33.702', '2026-05-07 17:41:33.702', 'SILVER'),
(581, 'Customer 80', '0903122094', 'customer80@example.com', '80 Le Loi St, District 1, HCMC', 'facebook', 'social_80', '2026-05-07 17:41:33.704', '2026-05-07 17:41:33.704', 'SILVER'),
(582, 'Customer 81', '0903246869', 'customer81@example.com', '81 Le Loi St, District 1, HCMC', 'zalo', 'social_81', '2026-05-07 17:41:33.706', '2026-05-07 17:41:33.706', 'SILVER'),
(583, 'Customer 82', '0900025618', 'customer82@example.com', '82 Le Loi St, District 1, HCMC', 'facebook', 'social_82', '2026-05-07 17:41:33.708', '2026-05-07 17:41:33.708', 'SILVER'),
(584, 'Customer 83', '0909520310', 'customer83@example.com', '83 Le Loi St, District 1, HCMC', 'zalo', 'social_83', '2026-05-07 17:41:33.710', '2026-05-07 17:41:33.710', 'SILVER'),
(585, 'Customer 84', '0907720787', 'customer84@example.com', '84 Le Loi St, District 1, HCMC', 'facebook', 'social_84', '2026-05-07 17:41:33.713', '2026-05-07 17:41:33.713', 'SILVER'),
(586, 'Customer 85', '0904726548', 'customer85@example.com', '85 Le Loi St, District 1, HCMC', 'zalo', 'social_85', '2026-05-07 17:41:33.715', '2026-05-07 17:41:33.715', 'SILVER'),
(587, 'Customer 86', '0904971874', 'customer86@example.com', '86 Le Loi St, District 1, HCMC', 'facebook', 'social_86', '2026-05-07 17:41:33.718', '2026-05-07 17:41:33.718', 'SILVER'),
(588, 'Customer 87', '0907340550', 'customer87@example.com', '87 Le Loi St, District 1, HCMC', 'zalo', 'social_87', '2026-05-07 17:41:33.720', '2026-05-07 17:41:33.720', 'SILVER'),
(589, 'Customer 88', '0909023571', 'customer88@example.com', '88 Le Loi St, District 1, HCMC', 'facebook', 'social_88', '2026-05-07 17:41:33.722', '2026-05-07 17:41:33.722', 'SILVER'),
(590, 'Customer 89', '0900715313', 'customer89@example.com', '89 Le Loi St, District 1, HCMC', 'zalo', 'social_89', '2026-05-07 17:41:33.724', '2026-05-07 17:41:33.724', 'SILVER'),
(591, 'Customer 90', '0900803390', 'customer90@example.com', '90 Le Loi St, District 1, HCMC', 'facebook', 'social_90', '2026-05-07 17:41:33.727', '2026-05-07 17:41:33.727', 'SILVER'),
(592, 'Customer 91', '0902461375', 'customer91@example.com', '91 Le Loi St, District 1, HCMC', 'zalo', 'social_91', '2026-05-07 17:41:33.729', '2026-05-07 17:41:33.729', 'SILVER'),
(593, 'Customer 92', '0908001301', 'customer92@example.com', '92 Le Loi St, District 1, HCMC', 'facebook', 'social_92', '2026-05-07 17:41:33.731', '2026-05-07 17:41:33.731', 'SILVER'),
(594, 'Customer 93', '0907397061', 'customer93@example.com', '93 Le Loi St, District 1, HCMC', 'zalo', 'social_93', '2026-05-07 17:41:33.733', '2026-05-07 17:41:33.733', 'SILVER'),
(595, 'Customer 94', '0902399652', 'customer94@example.com', '94 Le Loi St, District 1, HCMC', 'facebook', 'social_94', '2026-05-07 17:41:33.736', '2026-05-07 17:41:33.736', 'SILVER'),
(596, 'Customer 95', '0909214813', 'customer95@example.com', '95 Le Loi St, District 1, HCMC', 'zalo', 'social_95', '2026-05-07 17:41:33.738', '2026-05-07 17:41:33.738', 'SILVER'),
(597, 'Customer 96', '0905090421', 'customer96@example.com', '96 Le Loi St, District 1, HCMC', 'facebook', 'social_96', '2026-05-07 17:41:33.740', '2026-05-07 17:41:33.740', 'SILVER'),
(598, 'Customer 97', '0903414418', 'customer97@example.com', '97 Le Loi St, District 1, HCMC', 'zalo', 'social_97', '2026-05-07 17:41:33.742', '2026-05-07 17:41:33.742', 'SILVER'),
(599, 'Customer 98', '0901967201', 'customer98@example.com', '98 Le Loi St, District 1, HCMC', 'facebook', 'social_98', '2026-05-07 17:41:33.745', '2026-05-07 17:41:33.745', 'SILVER'),
(600, 'Customer 99', '0900381000', 'customer99@example.com', '99 Le Loi St, District 1, HCMC', 'zalo', 'social_99', '2026-05-07 17:41:33.747', '2026-05-07 17:41:33.747', 'SILVER'),
(601, 'Customer 100', '0907921986', 'customer100@example.com', '100 Le Loi St, District 1, HCMC', 'facebook', 'social_100', '2026-05-07 17:41:33.749', '2026-05-08 01:58:32.163', 'SILVER');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customernote`
--

CREATE TABLE `customernote` (
  `id` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `content` text NOT NULL,
  `staffName` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `customernote`
--

INSERT INTO `customernote` (`id`, `customerId`, `content`, `staffName`, `createdAt`) VALUES
(1, 593, 'gfgf', 'Nhân viên', '2026-05-08 01:44:28.709'),
(2, 593, 'df', 'Nhân viên', '2026-05-08 01:46:08.658'),
(3, 593, 'df', 'Nhân viên', '2026-05-08 01:46:10.393'),
(4, 601, 'Đã gửi mã giảm giá 10% cho khách hàng.', 'Hệ thống', '2026-05-08 01:55:24.809'),
(5, 601, 'Đã gửi mã giảm giá 20% cho khách hàng.', 'Hệ thống', '2026-05-08 01:55:40.321'),
(6, 601, 'Đã gửi mã giảm giá 10% cho khách hàng.', 'Hệ thống', '2026-05-08 01:57:44.497'),
(7, 601, 'Đã gửi mã giảm giá 50% cho khách hàng.', 'Hệ thống', '2026-05-08 01:58:05.370'),
(8, 508, 'hêhehe', 'Nhân viên', '2026-05-08 03:17:36.269');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `senderType` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `message`
--

INSERT INTO `message` (`id`, `conversationId`, `senderType`, `content`, `createdAt`) VALUES
(193, 92, 'customer', 'Hi, is this available?', '2026-05-02 17:41:34.345'),
(194, 92, 'bot', 'Yes, it is in stock!', '2026-05-02 17:41:34.345'),
(195, 93, 'customer', 'Hi, is this available?', '2026-05-02 17:41:34.353'),
(196, 93, 'bot', 'Yes, it is in stock!', '2026-05-02 17:41:34.353'),
(197, 94, 'customer', 'Hi, is this available?', '2026-05-05 17:41:34.360'),
(198, 94, 'bot', 'Yes, it is in stock!', '2026-05-05 17:41:34.360'),
(199, 95, 'customer', 'Hi, is this available?', '2026-05-04 17:41:34.367'),
(200, 95, 'bot', 'Yes, it is in stock!', '2026-05-04 17:41:34.367'),
(201, 96, 'customer', 'Hi, is this available?', '2026-05-03 17:41:34.375'),
(202, 96, 'bot', 'Yes, it is in stock!', '2026-05-03 17:41:34.375'),
(203, 97, 'customer', 'Hi, is this available?', '2026-05-06 17:41:34.385'),
(204, 97, 'bot', 'Yes, it is in stock!', '2026-05-06 17:41:34.385'),
(205, 98, 'customer', 'Hi, is this available?', '2026-05-04 17:41:34.393'),
(206, 98, 'bot', 'Yes, it is in stock!', '2026-05-04 17:41:34.393'),
(207, 99, 'customer', 'Hi, is this available?', '2026-05-03 17:41:34.401'),
(208, 99, 'bot', 'Yes, it is in stock!', '2026-05-03 17:41:34.401'),
(209, 100, 'customer', 'Hi, is this available?', '2026-05-05 17:41:34.410'),
(210, 100, 'bot', 'Yes, it is in stock!', '2026-05-05 17:41:34.410'),
(211, 101, 'customer', 'Hi, is this available?', '2026-05-02 17:41:34.419'),
(212, 101, 'bot', 'Yes, it is in stock!', '2026-05-02 17:41:34.419'),
(213, 102, 'customer', 'Hi, is this available?', '2026-05-06 17:41:34.428'),
(214, 102, 'bot', 'Yes, it is in stock!', '2026-05-06 17:41:34.428'),
(215, 103, 'customer', 'Hi, is this available?', '2026-05-02 17:41:34.436'),
(216, 103, 'bot', 'Yes, it is in stock!', '2026-05-02 17:41:34.436'),
(217, 104, 'customer', 'Hi, is this available?', '2026-05-03 17:41:34.444'),
(218, 104, 'bot', 'Yes, it is in stock!', '2026-05-03 17:41:34.444'),
(219, 105, 'customer', 'Hi, is this available?', '2026-05-05 17:41:34.451'),
(220, 105, 'bot', 'Yes, it is in stock!', '2026-05-05 17:41:34.451'),
(221, 106, 'customer', 'Hi, is this available?', '2026-05-03 17:41:34.459'),
(222, 106, 'bot', 'Yes, it is in stock!', '2026-05-03 17:41:34.459'),
(223, 107, 'customer', 'Hi, is this available?', '2026-05-04 17:41:34.467'),
(224, 107, 'bot', 'Yes, it is in stock!', '2026-05-04 17:41:34.467'),
(225, 108, 'customer', 'Hi, is this available?', '2026-05-02 17:41:34.475'),
(226, 108, 'bot', 'Yes, it is in stock!', '2026-05-02 17:41:34.475'),
(227, 109, 'customer', 'Hi, is this available?', '2026-05-02 17:41:34.483'),
(228, 109, 'bot', 'Yes, it is in stock!', '2026-05-02 17:41:34.483'),
(229, 110, 'customer', 'Hi, is this available?', '2026-05-03 17:41:34.490'),
(230, 110, 'bot', 'Yes, it is in stock!', '2026-05-03 17:41:34.490'),
(231, 102, 'staff', 'hi', '2026-05-08 03:12:22.748'),
(232, 102, 'staff', 'sss', '2026-05-08 03:13:30.987'),
(233, 102, 'staff', 'dsds', '2026-05-08 03:13:33.475'),
(234, 97, 'staff', 'd', '2026-05-08 03:14:17.724'),
(235, 97, 'customer', 'd', '2026-05-08 06:21:01.753'),
(236, 97, 'customer', 'd', '2026-05-08 06:21:01.792'),
(237, 97, 'customer', 'ssss', '2026-05-08 06:21:09.675'),
(238, 97, 'customer', 'ssss', '2026-05-08 06:21:09.781'),
(239, 97, 'bot', 'Xin vui lòng cung cấp thông tin về sản phẩm bạn quan tâm, bao gồm tên, số điện thoại và địa chỉ để chúng tôi có thể thu thập thông tin đó. Chúng tôi sẽ giúp bạn tìm sản phẩm với giá tốt nhất và sẵn sàng hỗ trợ trực tiếp nếu cần.', '2026-05-08 06:21:10.685'),
(240, 97, 'bot', 'Xin lỗi, tôi không hiểu ý bạn muốn nói là gì. Bạn cần giúp với thông tin về sản phẩm hay có nhu cầu mua sắm nào không? Tôi sẽ cố gắng hỗ trợ một cách tốt nhất possible.', '2026-05-08 06:21:13.228'),
(241, 97, 'customer', 'd', '2026-05-08 06:30:38.930'),
(242, 97, 'staff', 'd', '2026-05-08 06:30:59.067'),
(243, 97, 'customer', 'ssss', '2026-05-08 06:31:08.012'),
(244, 97, 'customer', 'ssss', '2026-05-08 06:31:09.785'),
(245, 97, 'customer', 'ssss', '2026-05-08 06:31:14.828'),
(246, 97, 'bot', 'Xin lỗi, bạn đã gõ sai cú pháp. Bạn muốn biết thông tin về sản phẩm hay có nhu cầu mua sắm gì đó không? Nếu có nhu cầu mua sắm, tôi cần tên sản phẩm, số điện thoại và địa chỉ để hỗ trợ bạn thêm nhé.', '2026-05-08 06:31:15.221'),
(247, 97, 'bot', 'Xin lỗi, tôi không hiểu thông điệp của bạn. Bạn muốn biết giá sản phẩm nào? Hay hỏi về tồn kho? 或者你想购买什么产品？请提供产品的名称、联系方式（电话）、地址，我会根据你提供的信息给出帮助。', '2026-05-08 06:31:17.833'),
(248, 97, 'customer', 'alo', '2026-05-08 06:31:26.138'),
(249, 97, 'customer', 'alo', '2026-05-08 06:31:28.806'),
(250, 97, 'bot', 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay? Dựa trên dữ liệu sản phẩm tôi đã được cung cấp, tôi có thể đưa ra thông tin về giá và tồn kho của các sản phẩm. Nếu bạn có ý định mua hàng, hãy cho tôi biết tên, số điện thoại và địa chỉ của bạn để chúng tôi có thể hoàn tất giao dịch một cách tốt nhất.', '2026-05-08 06:31:32.444'),
(251, 97, 'customer', 'd', '2026-05-08 06:34:20.912'),
(252, 97, 'bot', 'Chắc chắn, tôi sẽ hỗ trợ bạn về thông tin sản phẩm. Nếu bạn muốn mua một sản phẩm nào đó, vui lòng cung cấp tên sản phẩm và thông tin liên lạc như số điện thoại và địa chỉ để chúng tôi có thể xử lý tiếp theo. Bạn có cần giúp đỡ ngay bây giờ không?', '2026-05-08 06:34:25.860'),
(253, 97, 'customer', 'alo', '2026-05-08 06:34:32.913'),
(254, 97, 'customer', 'alo', '2026-05-08 06:34:36.788'),
(255, 97, 'bot', 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay không? Hãy cho tôi biết tên sản phẩm, số điện thoại và địa chỉ của bạn nếu muốn mua hàng. Nếu cần gặp nhân viên hỗ trợ, hãy thông báo cho tôi biết.', '2026-05-08 06:34:39.933'),
(256, 97, 'customer', 'm là ai', '2026-05-08 06:34:47.239'),
(257, 97, 'customer', 'm là ai', '2026-05-08 06:34:50.786'),
(258, 97, 'bot', 'Xin lỗi đã gây hiểu lầm, tôi cần thông tin về sản phẩm cụ thể bạn muốn biết chứ không phải người tên m là ai. Bạn có thể cung cấp thông tin chi tiết hơn để tôi giúp đỡ? Tôi sẵn lòng thu thập thông tin khách hàng nếu họ muốn mua sản phẩm.', '2026-05-08 06:34:54.197'),
(259, 97, 'customer', 'alo', '2026-05-08 06:35:45.564'),
(260, 97, 'bot', 'Xin chào! Tôi có thể giúp gì cho bạn? Hãy cho tôi biết sản phẩm nào bạn quan tâm hoặc cần thông tin về tồn kho và giá cả. Nếu bạn muốn mua hàng, hãy cung cấp tên, số điện thoại và địa chỉ, tôi sẽ thu thập thông tin đó. Còn nếu bạn muốn tìm hiểu thêm về các sản phẩm, vui lòng cho tôi biết cụ thể.', '2026-05-08 06:35:52.515'),
(261, 97, 'customer', 'heheh', '2026-05-08 06:35:58.732'),
(262, 97, 'bot', 'Xin chào! Tôi là trợ lý của bạn. Nếu bạn muốn biết thông tin về các sản phẩm, giá cả và tồn kho như nào thì hãy cho tôi biết mã sản phẩm cụ thể hoặc chỉ ra danh mục mà bạn quan tâm nhé. Hoặc nếu bạn muốn mua sản phẩm, vui lòng cung cấp cho tôi tên, số điện thoại và địa chỉ của bạn để chúng tôi có thể liên lạc lại. Hãy cho tôi biết nhu cầu của bạn nào!', '2026-05-08 06:36:06.520'),
(263, 97, 'customer', 't muốn mua hàng', '2026-05-08 06:36:13.299'),
(264, 97, 'bot', 'Chào bạn! Tôi có thể giúp gì cho bạn hôm nay? Bạn muốn mua sản phẩm nào trong danh sách tôi đã cung cấp? Hãy告知我你的选择, giá và tồn kho của sản phẩm đó để tôi có thể cập nhật thông tin chính xác. Sau khi nhận được thông tin từ bạn, tôi sẽ thu thập thêm thông tin liên lạc như số điện thoại và địa chỉ của bạn nếu cần thiết.', '2026-05-08 06:36:20.302'),
(265, 97, 'customer', 't muốn tư vấn về sản phẩm loại Sports', '2026-05-08 06:36:46.604'),
(266, 97, 'customer', 'alo', '2026-05-08 06:37:22.772'),
(267, 97, 'bot', 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay? Hãy cho tôi biết tên sản phẩm bạn quan tâm, số điện thoại và địa chỉ điạ để chúng tôi hỗ trợ tốt hơn. Nếu bạn muốn mua ngay, vui lòng cung cấp thông tin cá nhân đó.', '2026-05-08 06:37:28.662'),
(268, 97, 'customer', 't muốn tư vấn về sản phẩm loại Sports', '2026-05-08 06:37:34.975'),
(269, 97, 'bot', 'Xin chào! Để tư vấn sản phẩm tốt hơn, tôi cần biết cụ thể hơn về loại sản phẩm Thể thao nào bạn quan tâm như dép chạy bộ, quần áo tập gym hay các thiết bị khác? Đây chỉ mới là thông tin chung tổng quát về thể thao.', '2026-05-08 06:37:42.040'),
(270, 97, 'customer', 'quần áo thể thao', '2026-05-08 06:37:53.046'),
(271, 97, 'bot', 'Chúng tôi không có thông tin về sản phẩm cụ thể là \"quần áo thể thao\".烦请您提供更具体的信息，例如产品编号或详细描述，我才能帮您查找相关信息。如果您有兴趣购买任何产品，请告诉我您的姓名、联系电话和送达地址，我会立即记录下来以便后续处理。', '2026-05-08 06:38:01.152'),
(272, 97, 'customer', 'quần tập gym', '2026-05-08 06:38:09.421'),
(273, 97, 'bot', 'Xin lỗi tôi không thấy thông tin cụ thể về sản phẩm quần tập gym trong dữ liệu được cung cấp. Để hỗ trợ bạn tốt hơn, nếu có thể xin hãy cung cấp thêm chi tiết về mẫu, size hay bất kỳ yêu cầu nào khác nhé! Tôi sẽ rất vui lòng giúp đỡ khi có đủ thông tin.', '2026-05-08 06:38:15.220'),
(274, 97, 'customer', 't muốn biết giá của Product 110', '2026-05-08 06:39:48.463'),
(275, 97, 'bot', 'Dạ tôi xin lỗi, nhưng thông tin về sản phẩm có mã số \"Product 110\" không được tìm thấy trong danh sách mà chúng tôi cung cấp. Vui lòng kiểm tra lại tên sản phẩm hoặc danh mục bạn đang quan tâm để chắc chắn rằng nó tồn tại trong cơ sở dữ liệu của chúng tôi. Nếu đó là một lỗi kỹ thuật, tôi sẽ báo cáo vấn đề này ngay lập tức.', '2026-05-08 06:39:54.851'),
(276, 97, 'customer', 't muốn biết giá của Product 100', '2026-05-08 06:39:59.577'),
(277, 97, 'bot', 'Dạ bên em có Product 100 thuộc dòng beauty. Giá sản phẩm này là 483.845 đồng. Nếu bạn quan tâm đến thông tin thêm về sản phẩm này?', '2026-05-08 06:40:03.739'),
(278, 97, 'customer', 'có khuyến mãi k', '2026-05-08 06:40:16.713'),
(279, 97, 'bot', 'Tôi sẽ giúp bạn kiểm tra các sản phẩm trong danh sách để xem có khuyến mãi nào không. Bạn muốn biết về loại sản phẩm nào cụ thể? Ví dụ: đồ thể thao, đồ dùng nhà bếp hay mỹ phẩm?', '2026-05-08 06:40:22.862'),
(302, 112, 'customer', 'alo', '2026-05-08 07:04:46.191'),
(303, 112, 'bot', 'Xin chào! Rất vui được hỗ trợ bạn hôm nay. Bạn có cần tư vấn hoặc mua một sản phẩm nào không? Hay bạn muốn biết thêm thông tin về các loại vải, tính năng của sản phẩm?', '2026-05-08 07:04:49.027'),
(304, 112, 'customer', 'hi', '2026-05-08 07:04:57.004'),
(305, 112, 'bot', 'Xin chào! Tôi có thể tư vấn cho bạn một số kiến thức hoặc gợi ý một vài sản phẩm phù hợp. Bạn muốn biết thông tin về loại vải nào hay tính năng của các sản phẩm nào vậy? Hoặc nếu chưa quyết định, tôi cũng có thể gợi ý một số sản phẩm khác thay thế.', '2026-05-08 07:05:00.230'),
(306, 112, 'customer', 'Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối Server.', '2026-05-08 07:05:07.653'),
(307, 112, 'bot', 'Xin lỗi về sự cố này, hãy thử gửi yêu cầu phản hồi lại khách hàng vào lúc khác. Tôi sẽ xử lý sau khi có thể liên lạc với bạn trở lại.', '2026-05-08 07:05:10.466'),
(308, 112, 'customer', 't muốn mua quần áo thể thao', '2026-05-08 07:05:23.782'),
(309, 112, 'bot', 'Tư vấn kiến thức về vải và tính năng của quần áo thể thao:\n\n- Các loại vải như Polyester, Spandex có khả năng làm khô nhanh sau khi giặt, giúp bạn mặc ngay mà không cảm thấy ướt áum.\n- Vải Mesh thoáng khí tốt, thích hợp cho các hoạt động tập luyện trong thời tiết nóng bức.\n\nGiúp khách hàng tìm những sản phẩm thay thế phù hợp:\n\n1. Chất liệu Polyester Mesh - Sản phẩm có mã: Product 32\n   - Đặc điểm: Thấm hút mồ hôi, độ co giãn tốt\n   - Mô tả: Thiết kế thoáng mát giúp bạn cảm thấy thoải mái trong suốt buổi tập\n\n2. Chất liệu Spandex - Sản phẩm có mã: Product 27\n   - Đặc điểm: Độ co giãn cao, thay đổi theo hình dáng cơ thể \n   - Mô tả: Quần áo nhẹ nhàng, linh hoạt giúp nâng cao hiệu suất tập luyện\n\nNếu khách hàng muốn tìm hiểu thêm về sản phẩm nào đó cụ thể hoặc có câu hỏi chi tiết hơn vui lòng cho biết nhé.', '2026-05-08 07:05:30.108'),
(310, 112, 'customer', 'Nên chọn đồ gym thế nào?', '2026-05-08 07:05:47.101'),
(311, 112, 'bot', 'Để lựa chọn sản phẩm phù hợp với việc tập luyện tại nhà, tôi gợi ý một vài sản phẩm phổ biến và hữu ích:\n\n1. Đai chống trượt thể dục - Sản phẩm này rất cần thiết cho các bài tập như yoga hoặc pilates để giữ thăng bằng tốt hơn.\n2. Giò đệm tập gym - Chúng hỗ trợ người tập trong quá trình luyện tập, đặc biệt là khi thực hiện các bài tập squat và lunges.\n3. Đai kéo giãn cổ - Sản phẩm này giúp cải thiện khả năng kéo giãn cơ cổ, giảm căng thẳng sau tập.\n\nBạn có thể tham khảo thêm các sản phẩm như quạt mini để tập tại nhà, khăn lau mồ hôi, hoặc thậm chí là một chiếc máy chạy bộ giả nếu bạn muốn tăng cường sự đa dạng trong việc tập luyện.', '2026-05-08 07:05:52.118'),
(312, 112, 'customer', 'chi tiết về loại Đai kéo giãn cổ ', '2026-05-08 07:06:09.668'),
(313, 112, 'bot', 'Tôi xin lỗi, nhưng thông tin chi tiết cụ thể về loại đai kéo giãn cổ không được cung cấp trong dữ liệu của bạn. Dữ liệu hiện tại tập trung vào nhiều danh mục sản phẩm khác nhau như Thời trang, Làm đẹp, Thể thao và Công nghệ, nhưng không có loại đặc biệt như \"Đai kéo giãn cổ\". \n\nNếu bạn có thêm thông tin về loại đai cụ thể mà bạn đang quan tâm (ví dụ: thương hiệu, chức năng chính, chất liệu), tôi có thể cố gắng tìm kiếm thông tin từ dữ liệu hiện có. Hoặc nếu bạn có bất kỳ câu hỏi cụ thể nào về các danh mục khác, tôi sẽ rất vui lòng giúp đỡ. \n\nTrong trường hợp này, tôi khuyên bạn nên liên hệ trực tiếp với nhà cung cấp hoặc trang web bán hàng để nhận được thông tin chi tiết và chính xác nhất về sản phẩm đai kéo giãn cổ mà bạn quan tâm.', '2026-05-08 07:06:15.358'),
(314, 112, 'customer', 'm có những loại nào', '2026-05-08 07:06:33.517'),
(315, 112, 'bot', 'Tôi có thể đề xuất một số sản phẩm phù hợp cho bạn dựa trên các danh mục mà bạn đã cung cấp. Bạn vui lòng chỉ ra danh mục hoặc loại sản phẩm cụ thể bạn quan tâm, như Vải (ví dụ: Cotton), tính năng đặc biệt, hay dòng sản phẩm nào khác. Tôi sẽ tư vấn thêm về đó và gợi ý một vài sản phẩm phù hợp.', '2026-05-08 07:06:37.290'),
(316, 112, 'customer', 'm có những danh mục nào', '2026-05-08 07:06:54.250'),
(317, 112, 'bot', 'Bạn có các danh mục sau:\n\n1. **Thể thao và运动 (Sports)** - Bao gồm sản phẩm như quần áo, giày athletic, dụng cụ thể dục và các sản phẩm liên quan đến sức khỏe thể hình.\n2. **Mỹ phẩm和护肤 (Beauty)** - Các sản phẩm chăm sóc da, make-up, lotion và các sản phẩm tương tự.\n3. **Thời trang và Thời trang phụ kiện (Fashion and Fashion Accessories)** - Bao gồm quần áo, giày dép, mũ, túi xách và các phụ kiện khác.\n4. **Sức khỏe và Chăm sóc cá nhân (Health and Personal Care)** - Các sản phẩm chăm sóc sức khỏe như thuốc bổ, kem dưỡng da, dụng cụ vệ sinh răng miệng và nhiều hơn nữa.\n5. **Thể thao và运动 (Sports)** - Bao gồm các sản phẩm thể dục và dụng cụ thể thao.\n6. **Nước hoa và Fragrances** - Các loại nước hoa và mùi hương khác.\n\nĐối với mỗi danh mục, tôi có thể tư vấn cho bạn thông tin về vải liệu, tính năng của sản phẩm hoặc gợi ý một số sản phẩm phù hợp dựa trên sở thích và nhu cầu của bạn. Nếu bạn cần thêm thông tin về một danh mục cụ thể, hãy thông báo rõ hơn!', '2026-05-08 07:07:01.640'),
(318, 112, 'customer', 'Beauty tư vấn đi', '2026-05-08 07:07:17.993'),
(319, 112, 'bot', 'Chào bạn! Chúng tôi có nhiều sản phẩm chăm sóc da và làm đẹp, phù hợp với nhiều nhu cầu khác nhau. Nếu bạn đang cần gợi ý một số sản phẩm phù hợp, thì Beauty Essence và Toner là hai lựa chọn tốt đầu tiên dành cho việc dưỡng ẩm và cân bằng da.\n\n- **Beauty Essence**: Sản phẩm này cung cấp độ ẩm cần thiết cho da, giúp làm mềm, giảm kích ứng và tăng độ đàn hồi. \n\n- **Toner (Dưỡng Trắng):** Đây là bước cuối cùng trong quy trình skincare, sử dụng để khóa các dưỡng chất đã thẩm thấu vào da, đồng thời cân bằng độ pH của da.\n\nNếu bạn có thêm thông tin về loại da hoặc nhu cầu cụ thể hơn, tôi sẽ có thể gợi ý một số sản phẩm phù hợp nhất với bạn.', '2026-05-08 07:07:23.331'),
(320, 112, 'customer', 'hi', '2026-05-08 07:09:41.895'),
(321, 112, 'bot', 'Xin chào! Tôi có thể tư vấn kiến thức cho bạn hoặc gợi ý một số sản phẩm phù hợp dựa trên sở thích của bạn. Bạn muốn biết về chủ đề nào? Vải, tính năng sản phẩm hay gợi ý các sản phẩm cụ thể?', '2026-05-08 07:09:45.281'),
(322, 112, 'customer', 't muốn mua hàng', '2026-05-08 07:09:53.751'),
(323, 112, 'bot', 'Chào bạn, tôi sẽ tư vấn cho bạn một số sản phẩm phù hợp dựa trên sở thích hoặc nhu cầu của mình. Bạn có thể chia sẻ thêm về các sản phẩm mà bạn quan tâm không? Ví dụ: bạn muốn mua về làm gì (để mặc, sử dụng trong nhà,...)? Bạn đang tìm kiếm sản phẩm nào như giày dép, quần áo, phụ kiện… hay những sản phẩm khác?', '2026-05-08 07:09:57.760'),
(324, 112, 'customer', 'thôi t tự ái r', '2026-05-08 07:10:09.948'),
(325, 112, 'bot', 'Dạ hiểu rồi, tôi sẽ bắt đầu trả lời ngay cho khách hàng. Mong quý khách thông cảm nếu có vấn đề nào.\n\nHãy cho tôi biết phản hồi của khách hàng nhé!', '2026-05-08 07:10:13.230'),
(326, 112, 'customer', 'cút đi', '2026-05-08 07:10:24.740'),
(327, 112, 'bot', 'Tôi hiểu bạn cảm thấy không hài lòng, nhưng tôi cần giữ sự chuyên nghiệp trong mỗi cuộc trò chuyện để có thể hỗ trợ bạn tốt hơn. Hãy cho tôi biết cụ thể là gì bạn muốn thảo luận hoặc vấn đề nào bạn đang gặp phải, và tôi sẽ cố gắng giúp bạn một cách cẩn thận và kịp thời nhất.', '2026-05-08 07:10:28.109'),
(328, 97, 'staff', 'alo', '2026-05-08 07:10:40.300'),
(329, 97, 'customer', 'hi', '2026-05-08 07:10:54.269'),
(330, 97, 'bot', 'Xin chào! Tôi có thể tư vấn cho bạn một số kiến thức cơ bản hoặc gợi ý các sản phẩm phù hợp dựa trên những thông tin mà bạn cung cấp. Bạn muốn tìm hiểu về điều gì hay đang quan tâm đến sản phẩm nào không?', '2026-05-08 07:10:57.696'),
(331, 97, 'customer', 'alo', '2026-05-08 07:11:03.109'),
(332, 97, 'staff', 'alo', '2026-05-08 07:11:20.159');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `order`
--

INSERT INTO `order` (`id`, `customerId`, `totalAmount`, `status`, `createdAt`, `updatedAt`) VALUES
(1001, 548, 2880354.00, 'shipping', '2026-05-07 12:50:33.753', '2026-05-07 17:41:33.755'),
(1002, 519, 2237101.00, 'cancelled', '2026-04-28 04:30:33.758', '2026-05-07 17:41:33.759'),
(1003, 513, 2688184.00, 'confirmed', '2026-04-22 02:35:33.764', '2026-05-07 17:41:33.765'),
(1004, 591, 1559353.00, 'confirmed', '2026-04-20 19:21:33.768', '2026-05-07 17:41:33.769'),
(1005, 582, 875889.00, 'pending', '2026-04-20 00:18:33.771', '2026-05-07 17:41:33.772'),
(1006, 518, 3027106.00, 'confirmed', '2026-04-20 18:35:33.774', '2026-05-07 17:41:33.775'),
(1007, 524, 784050.00, 'pending', '2026-04-27 07:16:33.777', '2026-05-07 17:41:33.778'),
(1008, 522, 553142.00, 'pending', '2026-04-21 19:28:33.780', '2026-05-07 17:41:33.781'),
(1009, 571, 529134.00, 'completed', '2026-04-12 07:15:33.782', '2026-05-07 17:41:33.783'),
(1010, 581, 1163304.00, 'cancelled', '2026-04-29 22:45:33.785', '2026-05-07 17:41:33.787'),
(1011, 515, 1940577.00, 'cancelled', '2026-04-23 11:36:33.789', '2026-05-07 17:41:33.790'),
(1012, 546, 1792252.00, 'pending', '2026-05-05 21:58:33.792', '2026-05-07 17:41:33.793'),
(1013, 536, 999346.00, 'confirmed', '2026-04-12 09:47:33.795', '2026-05-07 17:41:33.796'),
(1014, 562, 1309794.00, 'cancelled', '2026-04-22 23:10:33.799', '2026-05-07 17:41:33.800'),
(1015, 529, 3626276.00, 'confirmed', '2026-05-01 15:54:33.803', '2026-05-07 17:41:33.804'),
(1016, 507, 2487975.00, 'completed', '2026-05-04 15:15:33.806', '2026-05-07 17:41:33.807'),
(1017, 592, 468950.00, 'cancelled', '2026-04-13 13:54:33.809', '2026-05-07 17:41:33.810'),
(1018, 509, 2263820.00, 'confirmed', '2026-05-05 09:59:33.812', '2026-05-07 17:41:33.813'),
(1019, 502, 1562434.00, 'cancelled', '2026-04-28 02:35:33.815', '2026-05-07 17:41:33.816'),
(1020, 574, 2720073.00, 'cancelled', '2026-04-17 02:28:33.818', '2026-05-07 17:41:33.819'),
(1021, 548, 3642880.00, 'shipping', '2026-04-10 23:29:33.821', '2026-05-07 17:41:33.822'),
(1022, 514, 1792252.00, 'completed', '2026-04-27 13:54:33.825', '2026-05-07 17:41:33.826'),
(1023, 523, 1306068.00, 'completed', '2026-04-30 12:42:33.827', '2026-05-07 17:41:33.828'),
(1024, 512, 2278702.00, 'completed', '2026-04-16 22:54:33.831', '2026-05-07 17:41:33.832'),
(1025, 514, 914211.00, 'cancelled', '2026-04-18 09:31:33.834', '2026-05-07 17:41:33.835'),
(1026, 542, 2911718.00, 'pending', '2026-04-29 09:36:33.837', '2026-05-07 17:41:33.838'),
(1027, 536, 620459.00, 'completed', '2026-04-25 16:54:33.840', '2026-05-07 17:41:33.841'),
(1028, 586, 3833661.00, 'pending', '2026-04-15 17:33:33.843', '2026-05-07 17:41:33.844'),
(1029, 581, 2690524.00, 'cancelled', '2026-04-25 23:27:33.846', '2026-05-07 17:41:33.847'),
(1030, 564, 2935432.00, 'pending', '2026-04-11 13:17:33.848', '2026-05-07 17:41:33.849'),
(1031, 543, 2602288.00, 'completed', '2026-04-30 15:19:33.852', '2026-05-07 17:41:33.853'),
(1032, 575, 1826428.00, 'shipping', '2026-04-17 04:13:33.855', '2026-05-07 17:41:33.856'),
(1033, 554, 739366.00, 'pending', '2026-04-14 15:08:33.858', '2026-05-07 17:41:33.859'),
(1034, 545, 390591.00, 'shipping', '2026-04-20 20:12:33.860', '2026-05-07 17:41:33.861'),
(1035, 540, 1366842.00, 'pending', '2026-04-09 05:50:33.863', '2026-05-07 17:41:33.864'),
(1036, 591, 866263.00, 'confirmed', '2026-04-16 19:55:33.866', '2026-05-07 17:41:33.867'),
(1037, 575, 2981583.00, 'pending', '2026-04-18 01:11:33.869', '2026-05-07 17:41:33.870'),
(1038, 593, 2665578.00, 'cancelled', '2026-04-20 03:17:33.873', '2026-05-07 17:41:33.873'),
(1039, 588, 1600294.00, 'cancelled', '2026-04-08 21:58:33.876', '2026-05-07 17:41:33.877'),
(1040, 559, 1731816.00, 'confirmed', '2026-04-26 10:17:33.879', '2026-05-07 17:41:33.880'),
(1041, 560, 702899.00, 'completed', '2026-04-28 20:47:33.882', '2026-05-07 17:41:33.883'),
(1042, 519, 2753939.00, 'completed', '2026-04-20 20:53:33.885', '2026-05-07 17:41:33.886'),
(1043, 534, 2868696.00, 'shipping', '2026-04-14 14:42:33.888', '2026-05-07 17:41:33.889'),
(1044, 560, 722828.00, 'cancelled', '2026-04-11 05:00:33.891', '2026-05-07 17:41:33.892'),
(1045, 534, 139235.00, 'shipping', '2026-04-13 14:57:33.894', '2026-05-07 17:41:33.894'),
(1046, 586, 485569.00, 'pending', '2026-04-25 04:33:33.896', '2026-05-07 17:41:33.897'),
(1047, 584, 2019192.00, 'pending', '2026-05-05 22:05:33.899', '2026-05-07 17:41:33.900'),
(1048, 518, 1361729.00, 'confirmed', '2026-04-08 21:57:33.902', '2026-05-07 17:41:33.903'),
(1049, 534, 1974198.00, 'confirmed', '2026-04-17 16:30:33.905', '2026-05-07 17:41:33.906'),
(1050, 580, 1905455.00, 'confirmed', '2026-04-19 02:37:33.908', '2026-05-07 17:41:33.909'),
(1051, 508, 1284819.00, 'completed', '2026-04-10 06:30:33.915', '2026-05-07 17:41:33.916'),
(1052, 502, 661606.00, 'pending', '2026-05-07 18:17:33.918', '2026-05-07 17:41:33.919'),
(1053, 529, 3340542.00, 'completed', '2026-04-10 00:27:33.921', '2026-05-07 17:41:33.922'),
(1054, 522, 1701554.00, 'cancelled', '2026-04-22 05:20:33.924', '2026-05-07 17:41:33.925'),
(1055, 587, 2235091.00, 'confirmed', '2026-04-28 02:35:33.927', '2026-05-07 17:41:33.928'),
(1056, 585, 1925791.00, 'completed', '2026-05-06 00:33:33.929', '2026-05-07 17:41:33.930'),
(1057, 579, 2518932.00, 'confirmed', '2026-04-13 09:41:33.933', '2026-05-07 17:41:33.934'),
(1058, 537, 1377626.00, 'pending', '2026-04-18 02:41:33.936', '2026-05-07 17:41:33.937'),
(1059, 549, 1248631.00, 'confirmed', '2026-05-07 10:30:33.938', '2026-05-07 17:41:33.939'),
(1060, 560, 615492.00, 'confirmed', '2026-04-28 15:31:33.941', '2026-05-07 17:41:33.942'),
(1061, 571, 915052.00, 'shipping', '2026-04-09 15:27:33.944', '2026-05-07 17:41:33.944'),
(1062, 569, 654286.00, 'completed', '2026-04-15 04:09:33.946', '2026-05-07 17:41:33.947'),
(1063, 544, 1906896.00, 'shipping', '2026-05-03 18:56:33.949', '2026-05-07 17:41:33.950'),
(1064, 516, 2589554.00, 'pending', '2026-05-06 17:09:33.951', '2026-05-07 17:41:33.952'),
(1065, 576, 1341416.00, 'cancelled', '2026-04-28 13:45:33.955', '2026-05-07 17:41:33.956'),
(1066, 578, 1345854.00, 'pending', '2026-04-21 12:38:33.957', '2026-05-07 17:41:33.958'),
(1067, 513, 3624184.00, 'pending', '2026-04-20 18:44:33.960', '2026-05-07 17:41:33.961'),
(1068, 590, 4540248.00, 'confirmed', '2026-04-27 13:35:33.963', '2026-05-07 17:41:33.964'),
(1069, 596, 1690091.00, 'confirmed', '2026-04-08 19:49:33.965', '2026-05-07 17:41:33.966'),
(1070, 523, 675656.00, 'completed', '2026-04-29 23:21:33.968', '2026-05-07 17:41:33.969'),
(1071, 550, 2008529.00, 'shipping', '2026-04-19 01:37:33.971', '2026-05-07 17:41:33.972'),
(1072, 531, 637037.00, 'shipping', '2026-04-13 00:55:33.974', '2026-05-07 17:41:33.974'),
(1073, 540, 1315540.00, 'cancelled', '2026-04-28 14:27:33.976', '2026-05-07 17:41:33.977'),
(1074, 549, 2223630.00, 'completed', '2026-04-25 20:07:33.979', '2026-05-07 17:41:33.980'),
(1075, 542, 1064672.00, 'completed', '2026-05-07 00:47:33.982', '2026-05-07 17:41:33.983'),
(1076, 540, 3098490.00, 'cancelled', '2026-04-18 00:56:33.985', '2026-05-07 17:41:33.986'),
(1077, 592, 853081.00, 'shipping', '2026-04-12 02:57:33.988', '2026-05-07 17:41:33.988'),
(1078, 592, 5348382.00, 'confirmed', '2026-04-19 10:59:33.990', '2026-05-07 17:41:33.991'),
(1079, 512, 1810912.00, 'completed', '2026-05-07 13:38:33.993', '2026-05-07 17:41:33.994'),
(1080, 562, 1441918.00, 'cancelled', '2026-05-03 01:14:33.996', '2026-05-07 17:41:33.997'),
(1081, 546, 3578729.00, 'pending', '2026-04-26 03:01:33.999', '2026-05-07 17:41:34.000'),
(1082, 562, 943136.00, 'shipping', '2026-04-28 22:45:34.002', '2026-05-07 17:41:34.002'),
(1083, 560, 2398255.00, 'cancelled', '2026-04-14 18:05:34.004', '2026-05-07 17:41:34.005'),
(1084, 527, 2873887.00, 'cancelled', '2026-04-26 20:09:34.007', '2026-05-07 17:41:34.008'),
(1085, 547, 4403328.00, 'pending', '2026-04-14 01:16:34.010', '2026-05-07 17:41:34.011'),
(1086, 517, 2602211.00, 'shipping', '2026-05-02 00:38:34.013', '2026-05-07 17:41:34.014'),
(1087, 601, 1755138.00, 'shipping', '2026-04-19 05:51:34.015', '2026-05-07 17:41:34.016'),
(1088, 581, 2644422.00, 'shipping', '2026-04-15 13:08:34.018', '2026-05-07 17:41:34.019'),
(1089, 545, 646943.00, 'completed', '2026-05-02 14:53:34.021', '2026-05-07 17:41:34.022'),
(1090, 572, 2152660.00, 'pending', '2026-04-28 04:07:34.023', '2026-05-07 17:41:34.024'),
(1091, 510, 1441918.00, 'cancelled', '2026-05-06 17:23:34.026', '2026-05-07 17:41:34.027'),
(1092, 546, 276571.00, 'completed', '2026-05-02 10:18:34.028', '2026-05-07 17:41:34.029'),
(1093, 592, 902338.00, 'shipping', '2026-04-17 01:24:34.031', '2026-05-07 17:41:34.032'),
(1094, 546, 1178203.00, 'confirmed', '2026-04-19 00:38:34.034', '2026-05-07 17:41:34.034'),
(1095, 545, 1226484.00, 'confirmed', '2026-04-27 15:58:34.036', '2026-05-07 17:41:34.037'),
(1096, 549, 3175065.00, 'completed', '2026-04-15 22:50:34.039', '2026-05-07 17:41:34.040'),
(1097, 521, 1125637.00, 'cancelled', '2026-04-13 11:41:34.042', '2026-05-07 17:41:34.043'),
(1098, 527, 2528228.00, 'completed', '2026-05-06 00:08:34.044', '2026-05-07 17:41:34.045'),
(1099, 502, 2870324.00, 'cancelled', '2026-04-21 06:40:34.047', '2026-05-07 17:41:34.048'),
(1100, 521, 2515103.00, 'pending', '2026-04-22 15:21:34.050', '2026-05-07 17:41:34.051'),
(1101, 570, 178015.00, 'cancelled', '2026-04-11 23:10:34.053', '2026-05-07 17:41:34.053'),
(1102, 597, 2471892.00, 'confirmed', '2026-04-21 07:49:34.055', '2026-05-07 17:41:34.056'),
(1103, 573, 4220552.00, 'cancelled', '2026-04-10 10:19:34.058', '2026-05-07 17:41:34.059'),
(1104, 575, 739366.00, 'completed', '2026-04-25 05:24:34.061', '2026-05-07 17:41:34.062'),
(1105, 585, 685200.00, 'completed', '2026-04-30 04:56:34.064', '2026-05-07 17:41:34.065'),
(1106, 543, 2201828.00, 'shipping', '2026-04-15 09:44:34.067', '2026-05-07 17:41:34.068'),
(1107, 599, 596965.00, 'cancelled', '2026-04-25 03:16:34.070', '2026-05-07 17:41:34.070'),
(1108, 509, 473363.00, 'confirmed', '2026-04-16 07:05:34.073', '2026-05-07 17:41:34.074'),
(1109, 584, 532336.00, 'confirmed', '2026-04-27 01:58:34.076', '2026-05-07 17:41:34.076'),
(1110, 576, 2549215.00, 'shipping', '2026-04-19 04:45:34.079', '2026-05-07 17:41:34.080'),
(1111, 579, 1049162.00, 'completed', '2026-04-30 12:19:34.082', '2026-05-07 17:41:34.083'),
(1112, 568, 3011141.00, 'pending', '2026-04-18 05:08:34.085', '2026-05-07 17:41:34.086'),
(1113, 510, 1484442.00, 'completed', '2026-05-01 02:49:34.088', '2026-05-07 17:41:34.089'),
(1114, 502, 1240918.00, 'cancelled', '2026-04-15 14:43:34.091', '2026-05-07 17:41:34.092'),
(1115, 519, 3347858.00, 'shipping', '2026-04-14 01:16:34.094', '2026-05-07 17:41:34.095'),
(1116, 552, 1836926.00, 'confirmed', '2026-05-08 14:04:34.096', '2026-05-07 17:41:34.097'),
(1117, 579, 3822052.00, 'pending', '2026-04-11 21:51:34.099', '2026-05-07 17:41:34.100'),
(1118, 534, 106816.00, 'shipping', '2026-05-07 07:43:34.102', '2026-05-07 17:41:34.103'),
(1119, 560, 4484064.00, 'completed', '2026-04-30 04:44:34.104', '2026-05-07 17:41:34.105'),
(1120, 509, 1294602.00, 'shipping', '2026-04-23 05:32:34.108', '2026-05-07 17:41:34.108'),
(1121, 595, 553142.00, 'shipping', '2026-04-23 11:39:34.110', '2026-05-07 17:41:34.111'),
(1122, 558, 2728735.00, 'shipping', '2026-05-01 13:11:34.113', '2026-05-07 17:41:34.114'),
(1123, 528, 1446460.00, 'completed', '2026-04-15 02:19:34.116', '2026-05-07 17:41:34.117'),
(1124, 551, 1038338.00, 'completed', '2026-05-06 13:38:34.118', '2026-05-07 17:41:34.119'),
(1125, 588, 1952458.00, 'pending', '2026-05-02 23:51:34.121', '2026-05-07 17:41:34.122'),
(1126, 560, 850777.00, 'shipping', '2026-04-14 16:18:34.124', '2026-05-07 17:41:34.125'),
(1127, 578, 483873.00, 'completed', '2026-04-17 09:40:34.127', '2026-05-07 17:41:34.128'),
(1128, 534, 1992080.00, 'confirmed', '2026-04-27 09:40:34.130', '2026-05-07 17:41:34.131'),
(1129, 561, 110257.00, 'shipping', '2026-04-28 20:06:34.132', '2026-05-07 17:41:34.133'),
(1130, 531, 2426132.00, 'cancelled', '2026-05-04 14:40:34.135', '2026-05-07 17:41:34.136'),
(1131, 595, 2269040.00, 'pending', '2026-04-11 05:32:34.138', '2026-05-07 17:41:34.139'),
(1132, 582, 1880496.00, 'pending', '2026-05-08 09:39:34.140', '2026-05-07 17:41:34.141'),
(1133, 571, 390591.00, 'cancelled', '2026-04-10 23:33:34.143', '2026-05-07 17:41:34.144'),
(1134, 582, 1444386.00, 'confirmed', '2026-04-12 02:25:34.146', '2026-05-07 17:41:34.147'),
(1135, 562, 1441053.00, 'shipping', '2026-04-16 02:21:34.149', '2026-05-07 17:41:34.150'),
(1136, 541, 1183272.00, 'completed', '2026-04-09 13:26:34.151', '2026-05-07 17:41:34.152'),
(1137, 568, 1602154.00, 'completed', '2026-04-21 02:06:34.154', '2026-05-07 17:41:34.155'),
(1138, 538, 2894263.00, 'cancelled', '2026-05-01 15:20:34.157', '2026-05-07 17:41:34.158'),
(1139, 543, 2402525.00, 'cancelled', '2026-04-11 12:53:34.160', '2026-05-07 17:41:34.161'),
(1140, 507, 3323621.00, 'completed', '2026-05-04 20:35:34.162', '2026-05-07 17:41:34.163'),
(1141, 594, 2951653.00, 'shipping', '2026-05-04 13:14:34.165', '2026-05-07 17:41:34.166'),
(1142, 569, 327143.00, 'shipping', '2026-04-20 07:56:34.168', '2026-05-07 17:41:34.169'),
(1143, 534, 342453.00, 'pending', '2026-04-18 16:58:34.172', '2026-05-07 17:41:34.173'),
(1144, 509, 3062588.00, 'cancelled', '2026-05-02 02:02:34.175', '2026-05-07 17:41:34.176'),
(1145, 578, 2468135.00, 'cancelled', '2026-04-16 05:46:34.178', '2026-05-07 17:41:34.179'),
(1146, 538, 1961900.00, 'confirmed', '2026-05-08 11:41:34.181', '2026-05-07 17:41:34.182'),
(1147, 554, 1271802.00, 'pending', '2026-04-16 03:05:34.184', '2026-05-07 17:41:34.185'),
(1148, 512, 2789448.00, 'pending', '2026-05-05 08:13:34.187', '2026-05-07 17:41:34.188'),
(1149, 558, 807921.00, 'confirmed', '2026-04-28 13:32:34.189', '2026-05-07 17:41:34.190'),
(1150, 576, 1274074.00, 'confirmed', '2026-04-15 15:56:34.192', '2026-05-07 17:41:34.193'),
(1151, 570, 1551924.00, 'pending', '2026-04-17 16:32:34.195', '2026-05-07 17:41:34.195'),
(1152, 506, 468950.00, 'completed', '2026-04-12 01:00:34.197', '2026-05-07 17:41:34.198'),
(1153, 522, 872216.00, 'shipping', '2026-04-18 08:57:34.200', '2026-05-07 17:41:34.201'),
(1154, 576, 3716295.00, 'confirmed', '2026-04-26 16:11:34.202', '2026-05-07 17:41:34.203'),
(1155, 522, 3942854.00, 'shipping', '2026-04-23 09:56:34.205', '2026-05-07 17:41:34.206'),
(1156, 531, 2431147.00, 'cancelled', '2026-04-16 07:10:34.208', '2026-05-07 17:41:34.209'),
(1157, 576, 2167400.00, 'confirmed', '2026-04-13 16:35:34.210', '2026-05-07 17:41:34.211'),
(1158, 513, 875611.00, 'shipping', '2026-04-11 08:02:34.213', '2026-05-07 17:41:34.214'),
(1159, 554, 250036.00, 'completed', '2026-04-19 21:51:34.216', '2026-05-07 17:41:34.217'),
(1160, 595, 3060711.00, 'cancelled', '2026-04-22 04:24:34.219', '2026-05-07 17:41:34.220'),
(1161, 523, 2625699.00, 'cancelled', '2026-04-21 22:44:34.221', '2026-05-07 17:41:34.222'),
(1162, 504, 3363965.00, 'completed', '2026-04-25 02:24:34.224', '2026-05-07 17:41:34.225'),
(1163, 601, 2352566.00, 'completed', '2026-04-10 19:41:34.227', '2026-05-07 17:41:34.228'),
(1164, 575, 795200.00, 'shipping', '2026-04-22 15:00:34.230', '2026-05-07 17:41:34.231'),
(1165, 552, 2950542.00, 'pending', '2026-04-24 12:55:34.233', '2026-05-07 17:41:34.234'),
(1166, 525, 1496128.00, 'cancelled', '2026-05-02 21:09:34.236', '2026-05-07 17:41:34.236'),
(1167, 554, 2830082.00, 'cancelled', '2026-04-22 09:25:34.238', '2026-05-07 17:41:34.239'),
(1168, 536, 1316310.00, 'confirmed', '2026-04-10 08:13:34.241', '2026-05-07 17:41:34.242'),
(1169, 550, 720959.00, 'pending', '2026-04-20 16:54:34.244', '2026-05-07 17:41:34.245'),
(1170, 589, 911855.00, 'pending', '2026-04-14 06:41:34.247', '2026-05-07 17:41:34.248'),
(1171, 578, 3061974.00, 'pending', '2026-05-08 09:16:34.250', '2026-05-07 17:41:34.251'),
(1172, 504, 486708.00, 'shipping', '2026-05-02 19:37:34.253', '2026-05-07 17:41:34.254'),
(1173, 552, 250036.00, 'shipping', '2026-04-19 20:26:34.255', '2026-05-07 17:41:34.257'),
(1174, 531, 1995278.00, 'cancelled', '2026-04-24 18:22:34.258', '2026-05-07 17:41:34.259'),
(1175, 521, 977455.00, 'shipping', '2026-04-24 20:45:34.261', '2026-05-07 17:41:34.262'),
(1176, 518, 1166332.00, 'shipping', '2026-05-03 23:34:34.264', '2026-05-07 17:41:34.265'),
(1177, 535, 3113341.00, 'confirmed', '2026-04-11 17:36:34.267', '2026-05-07 17:41:34.268'),
(1178, 518, 1602154.00, 'pending', '2026-04-11 14:48:34.270', '2026-05-07 17:41:34.271'),
(1179, 593, 2636621.00, 'pending', '2026-04-29 21:37:34.272', '2026-05-07 17:41:34.273'),
(1180, 600, 2687684.00, 'cancelled', '2026-04-19 23:08:34.275', '2026-05-07 17:41:34.276'),
(1181, 527, 1309599.00, 'confirmed', '2026-04-22 03:55:34.278', '2026-05-07 17:41:34.279'),
(1182, 563, 2852244.00, 'completed', '2026-04-09 00:30:34.281', '2026-05-07 17:41:34.282'),
(1183, 593, 2232194.00, 'shipping', '2026-04-24 03:06:34.283', '2026-05-07 17:41:34.284'),
(1184, 544, 1904231.00, 'cancelled', '2026-04-23 05:04:34.286', '2026-05-07 17:41:34.287'),
(1185, 514, 2996707.00, 'cancelled', '2026-04-18 01:56:34.289', '2026-05-07 17:41:34.290'),
(1186, 579, 949498.00, 'pending', '2026-05-04 10:13:34.292', '2026-05-07 17:41:34.293'),
(1187, 517, 2615884.00, 'cancelled', '2026-04-28 20:01:34.295', '2026-05-07 17:41:34.295'),
(1188, 600, 971138.00, 'cancelled', '2026-04-09 12:17:34.297', '2026-05-07 17:41:34.298'),
(1189, 575, 499274.00, 'completed', '2026-04-19 06:48:34.300', '2026-05-07 17:41:34.300'),
(1190, 520, 2560242.00, 'confirmed', '2026-04-15 03:54:34.302', '2026-05-07 17:41:34.303'),
(1191, 505, 3907886.00, 'cancelled', '2026-05-04 01:13:34.305', '2026-05-07 17:41:34.306'),
(1192, 538, 4298596.00, 'completed', '2026-04-29 00:29:34.308', '2026-05-07 17:41:34.308'),
(1193, 549, 2242924.00, 'pending', '2026-04-13 09:29:34.311', '2026-05-07 17:41:34.312'),
(1194, 522, 1447388.00, 'confirmed', '2026-05-07 12:01:34.314', '2026-05-07 17:41:34.315'),
(1195, 502, 987099.00, 'confirmed', '2026-04-27 05:51:34.317', '2026-05-07 17:41:34.318'),
(1196, 585, 1377626.00, 'completed', '2026-04-09 08:47:34.319', '2026-05-07 17:41:34.320'),
(1197, 513, 2382586.00, 'shipping', '2026-04-27 17:37:34.322', '2026-05-07 17:41:34.323'),
(1198, 583, 2560321.00, 'shipping', '2026-05-01 17:25:34.325', '2026-05-07 17:41:34.327'),
(1199, 522, 1908668.00, 'completed', '2026-04-25 07:30:34.329', '2026-05-07 17:41:34.330'),
(1200, 563, 1457488.00, 'pending', '2026-05-04 22:40:34.332', '2026-05-07 17:41:34.333');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderitem`
--

CREATE TABLE `orderitem` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orderitem`
--

INSERT INTO `orderitem` (`id`, `orderId`, `productId`, `quantity`, `price`) VALUES
(2034, 1001, 669, 2, 307746.00),
(2035, 1001, 632, 2, 866263.00),
(2036, 1001, 662, 1, 532336.00),
(2037, 1002, 653, 1, 929385.00),
(2038, 1002, 698, 1, 778582.00),
(2039, 1002, 602, 2, 264567.00),
(2040, 1003, 689, 2, 900035.00),
(2041, 1003, 645, 1, 214005.00),
(2042, 1003, 683, 1, 674109.00),
(2043, 1004, 657, 2, 337828.00),
(2044, 1004, 606, 2, 327143.00),
(2045, 1004, 608, 1, 229411.00),
(2046, 1005, 636, 1, 131617.00),
(2047, 1005, 692, 1, 530640.00),
(2048, 1005, 664, 2, 106816.00),
(2049, 1006, 639, 1, 657770.00),
(2050, 1006, 677, 2, 970663.00),
(2051, 1006, 645, 2, 214005.00),
(2052, 1007, 679, 2, 392025.00),
(2053, 1008, 625, 2, 276571.00),
(2054, 1009, 602, 2, 264567.00),
(2055, 1010, 688, 1, 330803.00),
(2056, 1010, 682, 1, 688813.00),
(2057, 1010, 690, 1, 143688.00),
(2058, 1011, 669, 2, 307746.00),
(2059, 1011, 608, 2, 229411.00),
(2060, 1011, 632, 1, 866263.00),
(2061, 1012, 660, 2, 896126.00),
(2062, 1013, 637, 2, 250036.00),
(2063, 1013, 630, 1, 499274.00),
(2064, 1014, 663, 1, 336378.00),
(2065, 1014, 647, 2, 486708.00),
(2066, 1015, 674, 1, 926723.00),
(2067, 1015, 653, 2, 929385.00),
(2068, 1015, 676, 1, 840783.00),
(2069, 1016, 634, 2, 957831.00),
(2070, 1016, 669, 1, 307746.00),
(2071, 1016, 602, 1, 264567.00),
(2072, 1017, 685, 1, 468950.00),
(2073, 1018, 660, 2, 896126.00),
(2074, 1018, 633, 1, 471568.00),
(2075, 1019, 664, 1, 106816.00),
(2076, 1019, 612, 1, 970049.00),
(2077, 1019, 614, 1, 485569.00),
(2078, 1020, 662, 2, 532336.00),
(2079, 1020, 620, 2, 584916.00),
(2080, 1020, 614, 1, 485569.00),
(2081, 1021, 677, 2, 970663.00),
(2082, 1021, 626, 2, 850777.00),
(2083, 1022, 660, 2, 896126.00),
(2084, 1023, 606, 2, 327143.00),
(2085, 1023, 657, 1, 337828.00),
(2086, 1023, 640, 2, 156977.00),
(2087, 1024, 605, 1, 398206.00),
(2088, 1024, 672, 2, 940248.00),
(2089, 1025, 628, 2, 104281.00),
(2090, 1025, 621, 1, 705649.00),
(2091, 1026, 611, 2, 705655.00),
(2092, 1026, 605, 1, 398206.00),
(2093, 1026, 629, 2, 551101.00),
(2094, 1027, 695, 1, 620459.00),
(2095, 1028, 673, 2, 980950.00),
(2096, 1028, 632, 2, 866263.00),
(2097, 1028, 668, 1, 139235.00),
(2098, 1029, 685, 1, 468950.00),
(2099, 1029, 677, 2, 970663.00),
(2100, 1029, 665, 1, 280248.00),
(2101, 1030, 674, 1, 926723.00),
(2102, 1030, 676, 2, 840783.00),
(2103, 1030, 606, 1, 327143.00),
(2104, 1031, 678, 2, 853081.00),
(2105, 1031, 660, 1, 896126.00),
(2106, 1032, 682, 2, 688813.00),
(2107, 1032, 643, 1, 448802.00),
(2108, 1033, 648, 2, 369683.00),
(2109, 1034, 651, 1, 390591.00),
(2110, 1035, 645, 2, 214005.00),
(2111, 1035, 659, 1, 938832.00),
(2112, 1036, 632, 1, 866263.00),
(2113, 1037, 661, 1, 403329.00),
(2114, 1037, 624, 2, 819711.00),
(2115, 1037, 659, 1, 938832.00),
(2116, 1038, 670, 2, 728744.00),
(2117, 1038, 605, 1, 398206.00),
(2118, 1038, 601, 1, 809884.00),
(2119, 1039, 636, 2, 131617.00),
(2120, 1039, 684, 1, 365922.00),
(2121, 1039, 614, 2, 485569.00),
(2122, 1040, 638, 2, 865908.00),
(2123, 1041, 630, 1, 499274.00),
(2124, 1041, 697, 1, 203625.00),
(2125, 1042, 692, 1, 530640.00),
(2126, 1042, 666, 1, 795111.00),
(2127, 1042, 610, 2, 714094.00),
(2128, 1043, 609, 1, 961800.00),
(2129, 1043, 641, 2, 953448.00),
(2130, 1044, 679, 1, 392025.00),
(2131, 1044, 688, 1, 330803.00),
(2132, 1045, 668, 1, 139235.00),
(2133, 1046, 614, 1, 485569.00),
(2134, 1047, 638, 2, 865908.00),
(2135, 1047, 690, 2, 143688.00),
(2136, 1048, 614, 2, 485569.00),
(2137, 1048, 651, 1, 390591.00),
(2138, 1049, 649, 2, 987099.00),
(2139, 1050, 676, 1, 840783.00),
(2140, 1050, 662, 2, 532336.00),
(2141, 1051, 616, 1, 877569.00),
(2142, 1051, 697, 2, 203625.00),
(2143, 1052, 688, 2, 330803.00),
(2144, 1053, 612, 2, 970049.00),
(2145, 1053, 642, 2, 700222.00),
(2146, 1054, 626, 2, 850777.00),
(2147, 1055, 652, 2, 594513.00),
(2148, 1055, 614, 1, 485569.00),
(2149, 1055, 665, 2, 280248.00),
(2150, 1056, 697, 1, 203625.00),
(2151, 1056, 665, 1, 280248.00),
(2152, 1056, 635, 2, 720959.00),
(2153, 1057, 648, 1, 369683.00),
(2154, 1057, 611, 1, 705655.00),
(2155, 1057, 696, 2, 721797.00),
(2156, 1058, 682, 2, 688813.00),
(2157, 1059, 646, 1, 647301.00),
(2158, 1059, 690, 2, 143688.00),
(2159, 1059, 640, 2, 156977.00),
(2160, 1060, 669, 2, 307746.00),
(2161, 1061, 604, 2, 457526.00),
(2162, 1062, 606, 2, 327143.00),
(2163, 1063, 641, 2, 953448.00),
(2164, 1064, 603, 2, 493700.00),
(2165, 1064, 650, 2, 801077.00),
(2166, 1065, 681, 1, 560234.00),
(2167, 1065, 651, 2, 390591.00),
(2168, 1066, 687, 2, 672927.00),
(2169, 1067, 601, 2, 809884.00),
(2170, 1067, 633, 2, 471568.00),
(2171, 1067, 692, 2, 530640.00),
(2172, 1068, 609, 2, 961800.00),
(2173, 1068, 658, 2, 872216.00),
(2174, 1068, 658, 1, 872216.00),
(2175, 1069, 607, 1, 723230.00),
(2176, 1069, 601, 1, 809884.00),
(2177, 1069, 640, 1, 156977.00),
(2178, 1070, 657, 2, 337828.00),
(2179, 1071, 691, 1, 130865.00),
(2180, 1071, 659, 2, 938832.00),
(2181, 1072, 631, 1, 637037.00),
(2182, 1073, 639, 2, 657770.00),
(2183, 1074, 673, 2, 980950.00),
(2184, 1074, 691, 2, 130865.00),
(2185, 1075, 662, 2, 532336.00),
(2186, 1076, 644, 1, 447777.00),
(2187, 1076, 682, 1, 688813.00),
(2188, 1076, 673, 2, 980950.00),
(2189, 1077, 678, 1, 853081.00),
(2190, 1078, 659, 2, 938832.00),
(2191, 1078, 666, 2, 795111.00),
(2192, 1078, 672, 2, 940248.00),
(2193, 1079, 678, 1, 853081.00),
(2194, 1079, 634, 1, 957831.00),
(2195, 1080, 635, 2, 720959.00),
(2196, 1081, 635, 1, 720959.00),
(2197, 1081, 611, 2, 705655.00),
(2198, 1081, 607, 2, 723230.00),
(2199, 1082, 633, 2, 471568.00),
(2200, 1083, 661, 2, 403329.00),
(2201, 1083, 695, 1, 620459.00),
(2202, 1083, 614, 2, 485569.00),
(2203, 1084, 605, 2, 398206.00),
(2204, 1084, 680, 2, 983609.00),
(2205, 1084, 693, 1, 110257.00),
(2206, 1085, 682, 2, 688813.00),
(2207, 1085, 638, 2, 865908.00),
(2208, 1085, 686, 2, 646943.00),
(2209, 1086, 646, 1, 647301.00),
(2210, 1086, 655, 2, 977455.00),
(2211, 1087, 616, 2, 877569.00),
(2212, 1088, 681, 2, 560234.00),
(2213, 1088, 662, 2, 532336.00),
(2214, 1088, 667, 2, 229641.00),
(2215, 1089, 686, 1, 646943.00),
(2216, 1090, 626, 1, 850777.00),
(2217, 1090, 678, 1, 853081.00),
(2218, 1090, 643, 1, 448802.00),
(2219, 1091, 635, 2, 720959.00),
(2220, 1092, 625, 1, 276571.00),
(2221, 1093, 687, 1, 672927.00),
(2222, 1093, 608, 1, 229411.00),
(2223, 1094, 679, 1, 392025.00),
(2224, 1094, 668, 1, 139235.00),
(2225, 1094, 686, 1, 646943.00),
(2226, 1095, 645, 2, 214005.00),
(2227, 1095, 695, 1, 620459.00),
(2228, 1095, 619, 1, 178015.00),
(2229, 1096, 685, 2, 468950.00),
(2230, 1096, 686, 1, 646943.00),
(2231, 1096, 666, 2, 795111.00),
(2232, 1097, 669, 2, 307746.00),
(2233, 1097, 664, 1, 106816.00),
(2234, 1097, 661, 1, 403329.00),
(2235, 1098, 638, 2, 865908.00),
(2236, 1098, 605, 2, 398206.00),
(2237, 1099, 649, 2, 987099.00),
(2238, 1099, 660, 1, 896126.00),
(2239, 1100, 642, 1, 700222.00),
(2240, 1100, 678, 1, 853081.00),
(2241, 1100, 609, 1, 961800.00),
(2242, 1101, 619, 1, 178015.00),
(2243, 1102, 632, 2, 866263.00),
(2244, 1102, 648, 2, 369683.00),
(2245, 1103, 620, 2, 584916.00),
(2246, 1103, 621, 2, 705649.00),
(2247, 1103, 624, 2, 819711.00),
(2248, 1104, 648, 2, 369683.00),
(2249, 1105, 633, 1, 471568.00),
(2250, 1105, 664, 2, 106816.00),
(2251, 1106, 612, 2, 970049.00),
(2252, 1106, 691, 2, 130865.00),
(2253, 1107, 647, 1, 486708.00),
(2254, 1107, 693, 1, 110257.00),
(2255, 1108, 622, 1, 473363.00),
(2256, 1109, 662, 1, 532336.00),
(2257, 1110, 636, 1, 131617.00),
(2258, 1110, 614, 2, 485569.00),
(2259, 1110, 607, 2, 723230.00),
(2260, 1111, 694, 1, 591636.00),
(2261, 1111, 604, 1, 457526.00),
(2262, 1112, 619, 1, 178015.00),
(2263, 1112, 680, 2, 983609.00),
(2264, 1112, 638, 1, 865908.00),
(2265, 1113, 682, 2, 688813.00),
(2266, 1113, 664, 1, 106816.00),
(2267, 1114, 695, 2, 620459.00),
(2268, 1115, 662, 2, 532336.00),
(2269, 1115, 623, 2, 214870.00),
(2270, 1115, 674, 2, 926723.00),
(2271, 1116, 632, 1, 866263.00),
(2272, 1116, 677, 1, 970663.00),
(2273, 1117, 617, 2, 984303.00),
(2274, 1117, 674, 2, 926723.00),
(2275, 1118, 664, 1, 106816.00),
(2276, 1119, 666, 2, 795111.00),
(2277, 1119, 601, 2, 809884.00),
(2278, 1119, 631, 2, 637037.00),
(2279, 1120, 646, 2, 647301.00),
(2280, 1121, 625, 2, 276571.00),
(2281, 1122, 658, 2, 872216.00),
(2282, 1122, 617, 1, 984303.00),
(2283, 1123, 607, 2, 723230.00),
(2284, 1124, 623, 1, 214870.00),
(2285, 1124, 681, 1, 560234.00),
(2286, 1124, 636, 2, 131617.00),
(2287, 1125, 645, 1, 214005.00),
(2288, 1125, 606, 1, 327143.00),
(2289, 1125, 611, 2, 705655.00),
(2290, 1126, 626, 1, 850777.00),
(2291, 1127, 665, 1, 280248.00),
(2292, 1127, 697, 1, 203625.00),
(2293, 1128, 642, 2, 700222.00),
(2294, 1128, 694, 1, 591636.00),
(2295, 1129, 693, 1, 110257.00),
(2296, 1130, 617, 2, 984303.00),
(2297, 1130, 604, 1, 457526.00),
(2298, 1131, 700, 1, 483845.00),
(2299, 1131, 625, 1, 276571.00),
(2300, 1131, 615, 2, 754312.00),
(2301, 1132, 672, 2, 940248.00),
(2302, 1133, 651, 1, 390591.00),
(2303, 1134, 667, 2, 229641.00),
(2304, 1134, 651, 1, 390591.00),
(2305, 1134, 652, 1, 594513.00),
(2306, 1135, 700, 2, 483845.00),
(2307, 1135, 622, 1, 473363.00),
(2308, 1136, 694, 2, 591636.00),
(2309, 1137, 650, 2, 801077.00),
(2310, 1138, 609, 2, 961800.00),
(2311, 1138, 677, 1, 970663.00),
(2312, 1139, 676, 2, 840783.00),
(2313, 1139, 635, 1, 720959.00),
(2314, 1140, 672, 2, 940248.00),
(2315, 1140, 615, 1, 754312.00),
(2316, 1140, 682, 1, 688813.00),
(2317, 1141, 649, 2, 987099.00),
(2318, 1141, 655, 1, 977455.00),
(2319, 1142, 606, 1, 327143.00),
(2320, 1143, 671, 1, 342453.00),
(2321, 1144, 610, 2, 714094.00),
(2322, 1144, 649, 1, 987099.00),
(2323, 1144, 646, 1, 647301.00),
(2324, 1145, 678, 1, 853081.00),
(2325, 1145, 641, 1, 953448.00),
(2326, 1145, 688, 2, 330803.00),
(2327, 1146, 673, 2, 980950.00),
(2328, 1147, 627, 1, 771730.00),
(2329, 1147, 637, 2, 250036.00),
(2330, 1148, 696, 2, 721797.00),
(2331, 1148, 687, 2, 672927.00),
(2332, 1149, 654, 1, 807921.00),
(2333, 1150, 631, 2, 637037.00),
(2334, 1151, 681, 2, 560234.00),
(2335, 1151, 699, 2, 215728.00),
(2336, 1152, 685, 1, 468950.00),
(2337, 1153, 658, 1, 872216.00),
(2338, 1154, 632, 1, 866263.00),
(2339, 1154, 641, 2, 953448.00),
(2340, 1154, 633, 2, 471568.00),
(2341, 1155, 632, 2, 866263.00),
(2342, 1155, 642, 2, 700222.00),
(2343, 1155, 601, 1, 809884.00),
(2344, 1156, 631, 1, 637037.00),
(2345, 1156, 610, 2, 714094.00),
(2346, 1156, 684, 1, 365922.00),
(2347, 1157, 640, 2, 156977.00),
(2348, 1157, 674, 2, 926723.00),
(2349, 1158, 688, 2, 330803.00),
(2350, 1158, 645, 1, 214005.00),
(2351, 1159, 637, 1, 250036.00),
(2352, 1160, 684, 2, 365922.00),
(2353, 1160, 676, 2, 840783.00),
(2354, 1160, 646, 1, 647301.00),
(2355, 1161, 670, 1, 728744.00),
(2356, 1161, 629, 1, 551101.00),
(2357, 1161, 687, 2, 672927.00),
(2358, 1162, 660, 2, 896126.00),
(2359, 1162, 643, 2, 448802.00),
(2360, 1162, 683, 1, 674109.00),
(2361, 1163, 683, 2, 674109.00),
(2362, 1163, 615, 1, 754312.00),
(2363, 1163, 637, 1, 250036.00),
(2364, 1164, 663, 1, 336378.00),
(2365, 1164, 608, 2, 229411.00),
(2366, 1165, 615, 2, 754312.00),
(2367, 1165, 635, 2, 720959.00),
(2368, 1166, 662, 2, 532336.00),
(2369, 1166, 699, 2, 215728.00),
(2370, 1167, 677, 1, 970663.00),
(2371, 1167, 628, 1, 104281.00),
(2372, 1167, 616, 2, 877569.00),
(2373, 1168, 696, 1, 721797.00),
(2374, 1168, 652, 1, 594513.00),
(2375, 1169, 635, 1, 720959.00),
(2376, 1170, 645, 2, 214005.00),
(2377, 1170, 700, 1, 483845.00),
(2378, 1171, 674, 1, 926723.00),
(2379, 1171, 639, 2, 657770.00),
(2380, 1171, 624, 1, 819711.00),
(2381, 1172, 647, 1, 486708.00),
(2382, 1173, 637, 1, 250036.00),
(2383, 1174, 621, 1, 705649.00),
(2384, 1174, 679, 1, 392025.00),
(2385, 1174, 643, 2, 448802.00),
(2386, 1175, 655, 1, 977455.00),
(2387, 1176, 694, 1, 591636.00),
(2388, 1176, 675, 2, 118434.00),
(2389, 1176, 657, 1, 337828.00),
(2390, 1177, 683, 1, 674109.00),
(2391, 1177, 662, 1, 532336.00),
(2392, 1177, 641, 2, 953448.00),
(2393, 1178, 650, 2, 801077.00),
(2394, 1179, 635, 1, 720959.00),
(2395, 1179, 634, 2, 957831.00),
(2396, 1180, 649, 2, 987099.00),
(2397, 1180, 667, 1, 229641.00),
(2398, 1180, 700, 1, 483845.00),
(2399, 1181, 626, 1, 850777.00),
(2400, 1181, 608, 2, 229411.00),
(2401, 1182, 674, 1, 926723.00),
(2402, 1182, 700, 2, 483845.00),
(2403, 1182, 634, 1, 957831.00),
(2404, 1183, 626, 2, 850777.00),
(2405, 1183, 692, 1, 530640.00),
(2406, 1184, 694, 2, 591636.00),
(2407, 1184, 635, 1, 720959.00),
(2408, 1185, 663, 2, 336378.00),
(2409, 1185, 650, 2, 801077.00),
(2410, 1185, 696, 1, 721797.00),
(2411, 1186, 687, 1, 672927.00),
(2412, 1186, 625, 1, 276571.00),
(2413, 1187, 642, 1, 700222.00),
(2414, 1187, 634, 2, 957831.00),
(2415, 1188, 614, 2, 485569.00),
(2416, 1189, 630, 1, 499274.00),
(2417, 1190, 617, 2, 984303.00),
(2418, 1190, 694, 1, 591636.00),
(2419, 1191, 689, 2, 900035.00),
(2420, 1191, 689, 2, 900035.00),
(2421, 1191, 669, 1, 307746.00),
(2422, 1192, 659, 2, 938832.00),
(2423, 1192, 648, 2, 369683.00),
(2424, 1192, 676, 2, 840783.00),
(2425, 1193, 692, 2, 530640.00),
(2426, 1193, 613, 2, 254444.00),
(2427, 1193, 663, 2, 336378.00),
(2428, 1194, 662, 1, 532336.00),
(2429, 1194, 604, 2, 457526.00),
(2430, 1195, 649, 1, 987099.00),
(2431, 1196, 682, 2, 688813.00),
(2432, 1197, 675, 1, 118434.00),
(2433, 1197, 638, 2, 865908.00),
(2434, 1197, 662, 1, 532336.00),
(2435, 1198, 648, 1, 369683.00),
(2436, 1198, 638, 2, 865908.00),
(2437, 1198, 608, 2, 229411.00),
(2438, 1199, 621, 1, 705649.00),
(2439, 1199, 688, 1, 330803.00),
(2440, 1199, 658, 1, 872216.00),
(2441, 1200, 670, 2, 728744.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `imageUrl` text DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `categoryId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `price`, `stock`, `imageUrl`, `status`, `categoryId`, `createdAt`, `updatedAt`) VALUES
(601, 'Product 1', 'Description for product 1. This is a high quality item.', 809884.00, 31, 'https://picsum.photos/seed/prod1/400/400', 'active', 26, '2026-05-07 17:41:33.238', '2026-05-07 17:41:33.238'),
(602, 'Product 2', 'Description for product 2. This is a high quality item.', 264567.00, 49, 'https://picsum.photos/seed/prod2/400/400', 'active', 26, '2026-05-07 17:41:33.241', '2026-05-07 17:41:33.241'),
(603, 'Product 3', 'Description for product 3. This is a high quality item.', 493700.00, 34, 'https://picsum.photos/seed/prod3/400/400', 'active', 27, '2026-05-07 17:41:33.243', '2026-05-07 17:41:33.243'),
(604, 'Product 4', 'Description for product 4. This is a high quality item.', 457526.00, 32, 'https://picsum.photos/seed/prod4/400/400', 'active', 28, '2026-05-07 17:41:33.246', '2026-05-07 17:41:33.246'),
(605, 'Product 5', 'Description for product 5. This is a high quality item.', 398206.00, 1, 'https://picsum.photos/seed/prod5/400/400', 'active', 28, '2026-05-07 17:41:33.248', '2026-05-07 17:41:33.248'),
(606, 'Product 6', 'Description for product 6. This is a high quality item.', 327143.00, 4, 'https://picsum.photos/seed/prod6/400/400', 'active', 29, '2026-05-07 17:41:33.251', '2026-05-07 17:41:33.251'),
(607, 'Product 7', 'Description for product 7. This is a high quality item.', 723230.00, 35, 'https://picsum.photos/seed/prod7/400/400', 'active', 27, '2026-05-07 17:41:33.254', '2026-05-07 17:41:33.254'),
(608, 'Product 8', 'Description for product 8. This is a high quality item.', 229411.00, 9, 'https://picsum.photos/seed/prod8/400/400', 'active', 28, '2026-05-07 17:41:33.256', '2026-05-07 17:41:33.256'),
(609, 'Product 9', 'Description for product 9. This is a high quality item.', 961800.00, 13, 'https://picsum.photos/seed/prod9/400/400', 'active', 29, '2026-05-07 17:41:33.260', '2026-05-07 17:41:33.260'),
(610, 'Product 10', 'Description for product 10. This is a high quality item.', 714094.00, 2, 'https://picsum.photos/seed/prod10/400/400', 'active', 27, '2026-05-07 17:41:33.263', '2026-05-07 17:41:33.263'),
(611, 'Product 11', 'Description for product 11. This is a high quality item.', 705655.00, 28, 'https://picsum.photos/seed/prod11/400/400', 'active', 27, '2026-05-07 17:41:33.266', '2026-05-07 17:41:33.266'),
(612, 'Product 12', 'Description for product 12. This is a high quality item.', 970049.00, 15, 'https://picsum.photos/seed/prod12/400/400', 'active', 28, '2026-05-07 17:41:33.269', '2026-05-07 17:41:33.269'),
(613, 'Product 13', 'Description for product 13. This is a high quality item.', 254444.00, 40, 'https://picsum.photos/seed/prod13/400/400', 'active', 30, '2026-05-07 17:41:33.271', '2026-05-07 17:41:33.271'),
(614, 'Product 14', 'Description for product 14. This is a high quality item.', 485569.00, 12, 'https://picsum.photos/seed/prod14/400/400', 'active', 29, '2026-05-07 17:41:33.274', '2026-05-07 17:41:33.274'),
(615, 'Product 15', 'Description for product 15. This is a high quality item.', 754312.00, 29, 'https://picsum.photos/seed/prod15/400/400', 'active', 30, '2026-05-07 17:41:33.276', '2026-05-07 17:41:33.276'),
(616, 'Product 16', 'Description for product 16. This is a high quality item.', 877569.00, 32, 'https://picsum.photos/seed/prod16/400/400', 'active', 27, '2026-05-07 17:41:33.278', '2026-05-07 17:41:33.278'),
(617, 'Product 17', 'Description for product 17. This is a high quality item.', 984303.00, 14, 'https://picsum.photos/seed/prod17/400/400', 'active', 27, '2026-05-07 17:41:33.281', '2026-05-07 17:41:33.281'),
(618, 'Product 18', 'Description for product 18. This is a high quality item.', 488975.00, 32, 'https://picsum.photos/seed/prod18/400/400', 'active', 27, '2026-05-07 17:41:33.283', '2026-05-07 17:41:33.283'),
(619, 'Product 19', 'Description for product 19. This is a high quality item.', 178015.00, 45, 'https://picsum.photos/seed/prod19/400/400', 'active', 28, '2026-05-07 17:41:33.286', '2026-05-07 17:41:33.286'),
(620, 'Product 20', 'Description for product 20. This is a high quality item.', 584916.00, 28, 'https://picsum.photos/seed/prod20/400/400', 'active', 30, '2026-05-07 17:41:33.288', '2026-05-07 17:41:33.288'),
(621, 'Product 21', 'Description for product 21. This is a high quality item.', 705649.00, 31, 'https://picsum.photos/seed/prod21/400/400', 'active', 27, '2026-05-07 17:41:33.290', '2026-05-07 17:41:33.290'),
(622, 'Product 22', 'Description for product 22. This is a high quality item.', 473363.00, 24, 'https://picsum.photos/seed/prod22/400/400', 'active', 26, '2026-05-07 17:41:33.293', '2026-05-07 17:41:33.293'),
(623, 'Product 23', 'Description for product 23. This is a high quality item.', 214870.00, 0, 'https://picsum.photos/seed/prod23/400/400', 'active', 29, '2026-05-07 17:41:33.295', '2026-05-07 17:41:33.295'),
(624, 'Product 24', 'Description for product 24. This is a high quality item.', 819711.00, 24, 'https://picsum.photos/seed/prod24/400/400', 'active', 27, '2026-05-07 17:41:33.297', '2026-05-07 17:41:33.297'),
(625, 'Product 25', 'Description for product 25. This is a high quality item.', 276571.00, 5, 'https://picsum.photos/seed/prod25/400/400', 'active', 30, '2026-05-07 17:41:33.300', '2026-05-07 17:41:33.300'),
(626, 'Product 26', 'Description for product 26. This is a high quality item.', 850777.00, 33, 'https://picsum.photos/seed/prod26/400/400', 'active', 30, '2026-05-07 17:41:33.302', '2026-05-07 17:41:33.302'),
(627, 'Product 27', 'Description for product 27. This is a high quality item.', 771730.00, 41, 'https://picsum.photos/seed/prod27/400/400', 'active', 30, '2026-05-07 17:41:33.304', '2026-05-07 17:41:33.304'),
(628, 'Product 28', 'Description for product 28. This is a high quality item.', 104281.00, 44, 'https://picsum.photos/seed/prod28/400/400', 'active', 26, '2026-05-07 17:41:33.307', '2026-05-07 17:41:33.307'),
(629, 'Product 29', 'Description for product 29. This is a high quality item.', 551101.00, 27, 'https://picsum.photos/seed/prod29/400/400', 'active', 27, '2026-05-07 17:41:33.310', '2026-05-07 17:41:33.310'),
(630, 'Product 30', 'Description for product 30. This is a high quality item.', 499274.00, 32, 'https://picsum.photos/seed/prod30/400/400', 'active', 26, '2026-05-07 17:41:33.312', '2026-05-07 17:41:33.312'),
(631, 'Product 31', 'Description for product 31. This is a high quality item.', 637037.00, 7, 'https://picsum.photos/seed/prod31/400/400', 'active', 26, '2026-05-07 17:41:33.315', '2026-05-07 17:41:33.315'),
(632, 'Product 32', 'Description for product 32. This is a high quality item.', 866263.00, 46, 'https://picsum.photos/seed/prod32/400/400', 'active', 30, '2026-05-07 17:41:33.317', '2026-05-07 17:41:33.317'),
(633, 'Product 33', 'Description for product 33. This is a high quality item.', 471568.00, 33, 'https://picsum.photos/seed/prod33/400/400', 'active', 26, '2026-05-07 17:41:33.319', '2026-05-07 17:41:33.319'),
(634, 'Product 34', 'Description for product 34. This is a high quality item.', 957831.00, 31, 'https://picsum.photos/seed/prod34/400/400', 'active', 29, '2026-05-07 17:41:33.322', '2026-05-07 17:41:33.322'),
(635, 'Product 35', 'Description for product 35. This is a high quality item.', 720959.00, 9, 'https://picsum.photos/seed/prod35/400/400', 'active', 27, '2026-05-07 17:41:33.324', '2026-05-07 17:41:33.324'),
(636, 'Product 36', 'Description for product 36. This is a high quality item.', 131617.00, 36, 'https://picsum.photos/seed/prod36/400/400', 'active', 28, '2026-05-07 17:41:33.327', '2026-05-07 17:41:33.327'),
(637, 'Product 37', 'Description for product 37. This is a high quality item.', 250036.00, 46, 'https://picsum.photos/seed/prod37/400/400', 'active', 27, '2026-05-07 17:41:33.329', '2026-05-07 17:41:33.329'),
(638, 'Product 38', 'Description for product 38. This is a high quality item.', 865908.00, 20, 'https://picsum.photos/seed/prod38/400/400', 'active', 26, '2026-05-07 17:41:33.332', '2026-05-07 17:41:33.332'),
(639, 'Product 39', 'Description for product 39. This is a high quality item.', 657770.00, 30, 'https://picsum.photos/seed/prod39/400/400', 'active', 30, '2026-05-07 17:41:33.334', '2026-05-07 17:41:33.334'),
(640, 'Product 40', 'Description for product 40. This is a high quality item.', 156977.00, 9, 'https://picsum.photos/seed/prod40/400/400', 'active', 29, '2026-05-07 17:41:33.337', '2026-05-07 17:41:33.337'),
(641, 'Product 41', 'Description for product 41. This is a high quality item.', 953448.00, 9, 'https://picsum.photos/seed/prod41/400/400', 'active', 30, '2026-05-07 17:41:33.339', '2026-05-07 17:41:33.339'),
(642, 'Product 42', 'Description for product 42. This is a high quality item.', 700222.00, 20, 'https://picsum.photos/seed/prod42/400/400', 'active', 28, '2026-05-07 17:41:33.342', '2026-05-07 17:41:33.342'),
(643, 'Product 43', 'Description for product 43. This is a high quality item.', 448802.00, 36, 'https://picsum.photos/seed/prod43/400/400', 'active', 29, '2026-05-07 17:41:33.344', '2026-05-07 17:41:33.344'),
(644, 'Product 44', 'Description for product 44. This is a high quality item.', 447777.00, 22, 'https://picsum.photos/seed/prod44/400/400', 'active', 26, '2026-05-07 17:41:33.347', '2026-05-07 17:41:33.347'),
(645, 'Product 45', 'Description for product 45. This is a high quality item.', 214005.00, 26, 'https://picsum.photos/seed/prod45/400/400', 'active', 27, '2026-05-07 17:41:33.350', '2026-05-07 17:41:33.350'),
(646, 'Product 46', 'Description for product 46. This is a high quality item.', 647301.00, 18, 'https://picsum.photos/seed/prod46/400/400', 'active', 29, '2026-05-07 17:41:33.352', '2026-05-07 17:41:33.352'),
(647, 'Product 47', 'Description for product 47. This is a high quality item.', 486708.00, 34, 'https://picsum.photos/seed/prod47/400/400', 'active', 28, '2026-05-07 17:41:33.354', '2026-05-07 17:41:33.354'),
(648, 'Product 48', 'Description for product 48. This is a high quality item.', 369683.00, 6, 'https://picsum.photos/seed/prod48/400/400', 'active', 27, '2026-05-07 17:41:33.357', '2026-05-07 17:41:33.357'),
(649, 'Product 49', 'Description for product 49. This is a high quality item.', 987099.00, 21, 'https://picsum.photos/seed/prod49/400/400', 'active', 28, '2026-05-07 17:41:33.359', '2026-05-07 17:41:33.359'),
(650, 'Product 50', 'Description for product 50. This is a high quality item.', 801077.00, 23, 'https://picsum.photos/seed/prod50/400/400', 'active', 28, '2026-05-07 17:41:33.362', '2026-05-07 17:41:33.362'),
(651, 'Product 51', 'Description for product 51. This is a high quality item.', 390591.00, 2, 'https://picsum.photos/seed/prod51/400/400', 'active', 26, '2026-05-07 17:41:33.365', '2026-05-07 17:41:33.365'),
(652, 'Product 52', 'Description for product 52. This is a high quality item.', 594513.00, 44, 'https://picsum.photos/seed/prod52/400/400', 'active', 29, '2026-05-07 17:41:33.367', '2026-05-07 17:41:33.367'),
(653, 'Product 53', 'Description for product 53. This is a high quality item.', 929385.00, 18, 'https://picsum.photos/seed/prod53/400/400', 'active', 27, '2026-05-07 17:41:33.369', '2026-05-07 17:41:33.369'),
(654, 'Product 54', 'Description for product 54. This is a high quality item.', 807921.00, 48, 'https://picsum.photos/seed/prod54/400/400', 'active', 29, '2026-05-07 17:41:33.372', '2026-05-07 17:41:33.372'),
(655, 'Product 55', 'Description for product 55. This is a high quality item.', 977455.00, 29, 'https://picsum.photos/seed/prod55/400/400', 'active', 28, '2026-05-07 17:41:33.374', '2026-05-07 17:41:33.374'),
(656, 'Product 56', 'Description for product 56. This is a high quality item.', 199547.00, 4, 'https://picsum.photos/seed/prod56/400/400', 'active', 26, '2026-05-07 17:41:33.377', '2026-05-07 17:41:33.377'),
(657, 'Product 57', 'Description for product 57. This is a high quality item.', 337828.00, 8, 'https://picsum.photos/seed/prod57/400/400', 'active', 27, '2026-05-07 17:41:33.380', '2026-05-07 17:41:33.380'),
(658, 'Product 58', 'Description for product 58. This is a high quality item.', 872216.00, 28, 'https://picsum.photos/seed/prod58/400/400', 'active', 28, '2026-05-07 17:41:33.382', '2026-05-07 17:41:33.382'),
(659, 'Product 59', 'Description for product 59. This is a high quality item.', 938832.00, 45, 'https://picsum.photos/seed/prod59/400/400', 'active', 29, '2026-05-07 17:41:33.385', '2026-05-07 17:41:33.385'),
(660, 'Product 60', 'Description for product 60. This is a high quality item.', 896126.00, 19, 'https://picsum.photos/seed/prod60/400/400', 'active', 28, '2026-05-07 17:41:33.387', '2026-05-07 17:41:33.387'),
(661, 'Product 61', 'Description for product 61. This is a high quality item.', 403329.00, 15, 'https://picsum.photos/seed/prod61/400/400', 'active', 28, '2026-05-07 17:41:33.390', '2026-05-07 17:41:33.390'),
(662, 'Product 62', 'Description for product 62. This is a high quality item.', 532336.00, 12, 'https://picsum.photos/seed/prod62/400/400', 'active', 26, '2026-05-07 17:41:33.393', '2026-05-07 17:41:33.393'),
(663, 'Product 63', 'Description for product 63. This is a high quality item.', 336378.00, 9, 'https://picsum.photos/seed/prod63/400/400', 'active', 28, '2026-05-07 17:41:33.395', '2026-05-07 17:41:33.395'),
(664, 'Product 64', 'Description for product 64. This is a high quality item.', 106816.00, 46, 'https://picsum.photos/seed/prod64/400/400', 'active', 26, '2026-05-07 17:41:33.398', '2026-05-07 17:41:33.398'),
(665, 'Product 65', 'Description for product 65. This is a high quality item.', 280248.00, 6, 'https://picsum.photos/seed/prod65/400/400', 'active', 27, '2026-05-07 17:41:33.400', '2026-05-07 17:41:33.400'),
(666, 'Product 66', 'Description for product 66. This is a high quality item.', 795111.00, 33, 'https://picsum.photos/seed/prod66/400/400', 'active', 28, '2026-05-07 17:41:33.403', '2026-05-07 17:41:33.403'),
(667, 'Product 67', 'Description for product 67. This is a high quality item.', 229641.00, 29, 'https://picsum.photos/seed/prod67/400/400', 'active', 30, '2026-05-07 17:41:33.405', '2026-05-07 17:41:33.405'),
(668, 'Product 68', 'Description for product 68. This is a high quality item.', 139235.00, 26, 'https://picsum.photos/seed/prod68/400/400', 'active', 26, '2026-05-07 17:41:33.408', '2026-05-07 17:41:33.408'),
(669, 'Product 69', 'Description for product 69. This is a high quality item.', 307746.00, 1, 'https://picsum.photos/seed/prod69/400/400', 'active', 27, '2026-05-07 17:41:33.412', '2026-05-07 17:41:33.412'),
(670, 'Product 70', 'Description for product 70. This is a high quality item.', 728744.00, 43, 'https://picsum.photos/seed/prod70/400/400', 'active', 28, '2026-05-07 17:41:33.415', '2026-05-07 17:41:33.415'),
(671, 'Product 71', 'Description for product 71. This is a high quality item.', 342453.00, 12, 'https://picsum.photos/seed/prod71/400/400', 'active', 28, '2026-05-07 17:41:33.418', '2026-05-07 17:41:33.418'),
(672, 'Product 72', 'Description for product 72. This is a high quality item.', 940248.00, 34, 'https://picsum.photos/seed/prod72/400/400', 'active', 28, '2026-05-07 17:41:33.421', '2026-05-07 17:41:33.421'),
(673, 'Product 73', 'Description for product 73. This is a high quality item.', 980950.00, 41, 'https://picsum.photos/seed/prod73/400/400', 'active', 29, '2026-05-07 17:41:33.425', '2026-05-07 17:41:33.425'),
(674, 'Product 74', 'Description for product 74. This is a high quality item.', 926723.00, 17, 'https://picsum.photos/seed/prod74/400/400', 'active', 30, '2026-05-07 17:41:33.427', '2026-05-07 17:41:33.427'),
(675, 'Product 75', 'Description for product 75. This is a high quality item.', 118434.00, 5, 'https://picsum.photos/seed/prod75/400/400', 'active', 28, '2026-05-07 17:41:33.430', '2026-05-07 17:41:33.430'),
(676, 'Product 76', 'Description for product 76. This is a high quality item.', 840783.00, 30, 'https://picsum.photos/seed/prod76/400/400', 'active', 26, '2026-05-07 17:41:33.433', '2026-05-07 17:41:33.433'),
(677, 'Product 77', 'Description for product 77. This is a high quality item.', 970663.00, 2, 'https://picsum.photos/seed/prod77/400/400', 'active', 29, '2026-05-07 17:41:33.435', '2026-05-07 17:41:33.435'),
(678, 'Product 78', 'Description for product 78. This is a high quality item.', 853081.00, 31, 'https://picsum.photos/seed/prod78/400/400', 'active', 28, '2026-05-07 17:41:33.438', '2026-05-07 17:41:33.438'),
(679, 'Product 79', 'Description for product 79. This is a high quality item.', 392025.00, 18, 'https://picsum.photos/seed/prod79/400/400', 'active', 29, '2026-05-07 17:41:33.442', '2026-05-07 17:41:33.442'),
(680, 'Product 80', 'Description for product 80. This is a high quality item.', 983609.00, 30, 'https://picsum.photos/seed/prod80/400/400', 'active', 29, '2026-05-07 17:41:33.445', '2026-05-07 17:41:33.445'),
(681, 'Product 81', 'Description for product 81. This is a high quality item.', 560234.00, 9, 'https://picsum.photos/seed/prod81/400/400', 'active', 28, '2026-05-07 17:41:33.447', '2026-05-07 17:41:33.447'),
(682, 'Product 82', 'Description for product 82. This is a high quality item.', 688813.00, 6, 'https://picsum.photos/seed/prod82/400/400', 'active', 28, '2026-05-07 17:41:33.450', '2026-05-07 17:41:33.450'),
(683, 'Product 83', 'Description for product 83. This is a high quality item.', 674109.00, 25, 'https://picsum.photos/seed/prod83/400/400', 'active', 27, '2026-05-07 17:41:33.452', '2026-05-07 17:41:33.452'),
(684, 'Product 84', 'Description for product 84. This is a high quality item.', 365922.00, 29, 'https://picsum.photos/seed/prod84/400/400', 'active', 26, '2026-05-07 17:41:33.455', '2026-05-07 17:41:33.455'),
(685, 'Product 85', 'Description for product 85. This is a high quality item.', 468950.00, 41, 'https://picsum.photos/seed/prod85/400/400', 'active', 28, '2026-05-07 17:41:33.457', '2026-05-07 17:41:33.457'),
(686, 'Product 86', 'Description for product 86. This is a high quality item.', 646943.00, 48, 'https://picsum.photos/seed/prod86/400/400', 'active', 28, '2026-05-07 17:41:33.460', '2026-05-07 17:41:33.460'),
(687, 'Product 87', 'Description for product 87. This is a high quality item.', 672927.00, 14, 'https://picsum.photos/seed/prod87/400/400', 'active', 30, '2026-05-07 17:41:33.463', '2026-05-07 17:41:33.463'),
(688, 'Product 88', 'Description for product 88. This is a high quality item.', 330803.00, 24, 'https://picsum.photos/seed/prod88/400/400', 'active', 27, '2026-05-07 17:41:33.465', '2026-05-07 17:41:33.465'),
(689, 'Product 89', 'Description for product 89. This is a high quality item.', 900035.00, 19, 'https://picsum.photos/seed/prod89/400/400', 'active', 28, '2026-05-07 17:41:33.468', '2026-05-07 17:41:33.468'),
(690, 'Product 90', 'Description for product 90. This is a high quality item.', 143688.00, 48, 'https://picsum.photos/seed/prod90/400/400', 'active', 28, '2026-05-07 17:41:33.471', '2026-05-07 17:41:33.471'),
(691, 'Product 91', 'Description for product 91. This is a high quality item.', 130865.00, 12, 'https://picsum.photos/seed/prod91/400/400', 'active', 30, '2026-05-07 17:41:33.473', '2026-05-07 17:41:33.473'),
(692, 'Product 92', 'Description for product 92. This is a high quality item.', 530640.00, 32, 'https://picsum.photos/seed/prod92/400/400', 'active', 29, '2026-05-07 17:41:33.476', '2026-05-07 17:41:33.476'),
(693, 'Product 93', 'Description for product 93. This is a high quality item.', 110257.00, 19, 'https://picsum.photos/seed/prod93/400/400', 'active', 29, '2026-05-07 17:41:33.479', '2026-05-07 17:41:33.479'),
(694, 'Product 94', 'Description for product 94. This is a high quality item.', 591636.00, 0, 'https://picsum.photos/seed/prod94/400/400', 'active', 26, '2026-05-07 17:41:33.481', '2026-05-07 17:41:33.481'),
(695, 'Product 95', 'Description for product 95. This is a high quality item.', 620459.00, 11, 'https://picsum.photos/seed/prod95/400/400', 'active', 26, '2026-05-07 17:41:33.484', '2026-05-07 17:41:33.484'),
(696, 'Product 96', 'Description for product 96. This is a high quality item.', 721797.00, 12, 'https://picsum.photos/seed/prod96/400/400', 'active', 28, '2026-05-07 17:41:33.487', '2026-05-07 17:41:33.487'),
(697, 'Product 97', 'Description for product 97. This is a high quality item.', 203625.00, 40, 'https://picsum.photos/seed/prod97/400/400', 'active', 27, '2026-05-07 17:41:33.489', '2026-05-07 17:41:33.489'),
(698, 'Product 98', 'Description for product 98. This is a high quality item.', 778582.00, 3, 'https://picsum.photos/seed/prod98/400/400', 'active', 30, '2026-05-07 17:41:33.492', '2026-05-07 17:41:33.492'),
(699, 'Product 99', 'Description for product 99. This is a high quality item.', 215728.00, 10, 'https://picsum.photos/seed/prod99/400/400', 'active', 30, '2026-05-07 17:41:33.494', '2026-05-07 17:41:33.494'),
(700, 'Product 100', 'Description for product 100. This is a high quality item.', 483845.00, 3, '/uploads/1778200458564-108445462.png', 'active', 30, '2026-05-07 17:41:33.497', '2026-05-08 02:26:25.580');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `socialintegration`
--

CREATE TABLE `socialintegration` (
  `id` int(11) NOT NULL,
  `platform` varchar(191) NOT NULL,
  `platformName` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'disconnected',
  `accessToken` text DEFAULT NULL,
  `accountInfo` text DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `socialintegration`
--

INSERT INTO `socialintegration` (`id`, `platform`, `platformName`, `status`, `accessToken`, `accountInfo`, `updatedAt`) VALUES
(16, 'facebook', 'FB Messenger', 'connected', NULL, 'Social Sales Page', '2026-05-07 17:41:33.219'),
(17, 'zalo', 'Zalo OA', 'connected', NULL, 'Social Sales Official', '2026-05-07 17:41:33.219'),
(18, 'instagram', 'Instagram Direct', 'disconnected', NULL, NULL, '2026-05-07 17:41:33.219');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `storesettings`
--

CREATE TABLE `storesettings` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'VND',
  `language` varchar(191) NOT NULL DEFAULT 'vi',
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `storesettings`
--

INSERT INTO `storesettings` (`id`, `name`, `phone`, `address`, `currency`, `language`, `updatedAt`) VALUES
(6, 'Social Sales Premium Store', '+84 987 654 321', '123 AI Boulevard, Tech District, Ho Chi Minh City', 'VND', 'vi', '2026-05-07 17:41:33.214');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `systemconfig`
--

CREATE TABLE `systemconfig` (
  `id` int(11) NOT NULL,
  `configKey` varchar(191) NOT NULL,
  `configValue` text NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `isSensitive` tinyint(1) NOT NULL DEFAULT 0,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `systemconfig`
--

INSERT INTO `systemconfig` (`id`, `configKey`, `configValue`, `description`, `isSensitive`, `updatedAt`) VALUES
(19, 'OPENAI_API_KEY', 'ollama', 'Main OpenAI Key', 1, '2026-05-07 17:41:33.217'),
(20, 'DEFAULT_MODEL', 'qwen2.5:3b', 'Recommended AI Model', 0, '2026-05-08 04:15:17.246'),
(21, 'MAX_TOKENS', '4096', 'Max token overhead', 0, '2026-05-08 04:15:17.250'),
(22, 'AI_BASE_URL', 'http://localhost:11434/v1', 'Ollama/Local AI URL', 0, '2026-05-08 04:15:17.234'),
(23, 'CHATBOT_PROMPT', 'Bạn là một chuyên viên tư vấn bán hàng năng động và thân thiện. \n\nQuy tắc:\n1. Luôn chào khách bằng \"Dạ, [Tên Shop] em chào mình ạ! ✨\"\n2. Sử dụng icon sinh động trong câu trả lời.\n3. Khi khách hỏi sản phẩm, hãy nêu bật ưu điểm và hỏi khách có muốn xem ảnh thật không.\n4. Mục tiêu cuối cùng là lấy được SĐT và Địa chỉ để lên đơn.', NULL, 0, '2026-05-08 04:15:17.254'),
(24, 'SMART_ASSIST_ENABLED', 'true', NULL, 0, '2026-05-08 07:11:21.824');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'staff',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `bioAiContext` text DEFAULT NULL,
  `designation` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `timezone` varchar(191) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `fullName`, `role`, `createdAt`, `updatedAt`, `bioAiContext`, `designation`, `email`, `timezone`) VALUES
(1, 'admin', '$2a$10$cK3eThcKMrd4ohMfMoBlMuqmXLAbpYR.HUkLj0NLExp7gSO6KI1XS', 'Administrator', 'admin', '2026-05-07 14:57:35.055', '2026-05-08 06:28:44.792', 'hehehe', 'Quản lý', 'heheh@gmail.com', 'Asia/Ho_Chi_Minh'),
(2, 'staff', '$2a$10$Hndh3fLtgR9C6MjmvKe1k.4SKIp0sLWoNwhespMfQEBq3T/o8Zne6', 'Staff Member', 'staff', '2026-05-07 14:57:35.064', '2026-05-07 14:57:35.064', NULL, NULL, NULL, 'Asia/Ho_Chi_Minh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('2d8f8d9f-941d-49ae-aa7c-1740772577cb', 'eae446c0e9639bc06a0283b4a90169cef7f37932248144b81c037fe8d9e00e4f', '2026-05-08 01:37:48.874', '20260508013748_add_rank_and_notes', NULL, NULL, '2026-05-08 01:37:48.809', 1),
('9ad05521-db73-429e-81c2-a21e5a1fffd5', '0499236059dafddd30bdcd8cd5e4ed9f005e31a33209245b314642b1c81478d1', '2026-05-07 16:46:05.144', '20260507164605_update_settings_and_botlogs', NULL, NULL, '2026-05-07 16:46:05.084', 1),
('a1b2d0c7-7097-43cd-8be2-aff11abc8325', 'aecb125a930cd9d26991efaf1ab6fda2f8e8752c3e6f3e0f5b5e1c5c1ea85bd3', '2026-05-07 14:57:23.551', '20260507145723_init', NULL, NULL, '2026-05-07 14:57:23.212', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_name_key` (`name`);

--
-- Chỉ mục cho bảng `chatbotlog`
--
ALTER TABLE `chatbotlog`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Conversation_customerId_fkey` (`customerId`);

--
-- Chỉ mục cho bảng `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Customer_phone_key` (`phone`),
  ADD UNIQUE KEY `Customer_email_key` (`email`);

--
-- Chỉ mục cho bảng `customernote`
--
ALTER TABLE `customernote`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CustomerNote_customerId_fkey` (`customerId`);

--
-- Chỉ mục cho bảng `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Message_conversationId_fkey` (`conversationId`);

--
-- Chỉ mục cho bảng `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Order_customerId_fkey` (`customerId`);

--
-- Chỉ mục cho bảng `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_orderId_fkey` (`orderId`),
  ADD KEY `OrderItem_productId_fkey` (`productId`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Product_categoryId_fkey` (`categoryId`);

--
-- Chỉ mục cho bảng `socialintegration`
--
ALTER TABLE `socialintegration`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `storesettings`
--
ALTER TABLE `storesettings`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `systemconfig`
--
ALTER TABLE `systemconfig`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `SystemConfig_configKey_key` (`configKey`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Chỉ mục cho bảng `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `chatbotlog`
--
ALTER TABLE `chatbotlog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;

--
-- AUTO_INCREMENT cho bảng `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT cho bảng `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=603;

--
-- AUTO_INCREMENT cho bảng `customernote`
--
ALTER TABLE `customernote`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=341;

--
-- AUTO_INCREMENT cho bảng `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1204;

--
-- AUTO_INCREMENT cho bảng `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2445;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=702;

--
-- AUTO_INCREMENT cho bảng `socialintegration`
--
ALTER TABLE `socialintegration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `storesettings`
--
ALTER TABLE `storesettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `systemconfig`
--
ALTER TABLE `systemconfig`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `conversation`
--
ALTER TABLE `conversation`
  ADD CONSTRAINT `Conversation_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `customernote`
--
ALTER TABLE `customernote`
  ADD CONSTRAINT `CustomerNote_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

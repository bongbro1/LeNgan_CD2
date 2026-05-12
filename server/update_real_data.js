const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const realData = {
  26: [ // Electronics
    { name: 'iPhone 15 Pro Max', description: 'Chip A17 Pro, Camera 48MP, Khung Titan bền bỉ.' },
    { name: 'MacBook Air M2', description: 'Siêu mỏng, chip M2 mạnh mẽ, pin 18 tiếng.' },
    { name: 'Sony WH-1000XM5', description: 'Tai nghe chống ồn đỉnh cao, âm thanh chi tiết.' },
    { name: 'iPad Pro M2', description: 'Màn hình Liquid Retina XDR, hiệu năng vượt trội.' },
    { name: 'Samsung Galaxy S23 Ultra', description: 'Camera 200MP, bút S-Pen tiện lợi.' },
    { name: 'Loa Marshall Stanmore III', description: 'Thiết kế cổ điển, âm thanh mạnh mẽ.' },
    { name: 'Chuột Logitech MX Master 3S', description: 'Chuột công việc tốt nhất, yên tĩnh và chính xác.' },
    { name: 'Bàn phím Keychron K8 Pro', description: 'Bàn phím cơ không dây, tùy biến cao.' },
    { name: 'Apple Watch Series 9', description: 'Theo dõi sức khỏe thông minh, màn hình sáng hơn.' },
    { name: 'Kindle Paperwhite 5', description: 'Màn hình 6.8 inch, chống nước, pin lâu.' },
    { name: 'PlayStation 5', description: 'Trải nghiệm chơi game 4K đỉnh cao.' },
    { name: 'Nintendo Switch OLED', description: 'Màn hình OLED rực rỡ, chơi game linh hoạt.' },
    { name: 'Máy ảnh Fujifilm X-T5', description: 'Phong cách cổ điển, cảm biến 40MP.' },
    { name: 'Màn hình Dell UltraSharp 27 inch', description: 'Độ phân giải 4K, màu sắc chuẩn xác.' },
    { name: 'Sạc dự phòng Anker 737', description: 'Sạc nhanh 140W, dung lượng lớn.' },
    { name: 'Ổ cứng SSD Samsung 990 Pro', description: 'Tốc độ đọc ghi cực nhanh.' },
    { name: 'Webcam Logitech Brio 4K', description: 'Hình ảnh sắc nét, tích hợp AI.' },
    { name: 'Microphone Shure SM7B', description: 'Chuẩn mực cho podcast và thu âm.' },
    { name: 'Router ASUS ROG Rapture', description: 'Wifi 6 siêu tốc, độ trễ thấp.' },
    { name: 'Máy chiếu Samsung The Freestyle', description: 'Nhỏ gọn, xoay 180 độ, âm thanh 360.' }
  ],
  27: [ // Fashion
    { name: 'Áo thun Uniqlo Airism', description: 'Chất liệu thoáng mát, công nghệ Airism.' },
    { name: 'Quần Jeans Levi\'s 501', description: 'Kiểu dáng huyền thoại, bền bỉ theo thời gian.' },
    { name: 'Giày Nike Air Force 1', description: 'Thiết kế iconic, dễ phối đồ.' },
    { name: 'Áo khoác The North Face', description: 'Chống gió, chống nước, giữ ấm cực tốt.' },
    { name: 'Váy Zara Summer Collection', description: 'Họa tiết hoa trẻ trung, vải voan nhẹ nhàng.' },
    { name: 'Túi xách Charles & Keith', description: 'Kiểu dáng thanh lịch, phù hợp đi làm.' },
    { name: 'Ví da cá sấu cao cấp', description: 'Làm từ da thật 100%, sang trọng.' },
    { name: 'Thắt lưng da Hermes', description: 'Phụ kiện đẳng cấp cho quý ông.' },
    { name: 'Kính mát Ray-Ban Aviator', description: 'Gọng mạ vàng, chống tia UV tuyệt đối.' },
    { name: 'Mũ lưỡi trai MLB NY', description: 'Phong cách đường phố năng động.' },
    { name: 'Áo sơ mi Oxford Ralph Lauren', description: 'Lịch lãm, chuẩn form dáng.' },
    { name: 'Quần Tây Âu cao cấp', description: 'Vải không nhăn, dáng đứng.' },
    { name: 'Đầm dạ hội đính đá', description: 'Sang trọng, tôn dáng cho các buổi tiệc.' },
    { name: 'Áo Hoodie Champion', description: 'Vải nỉ bông dày dặn, ấm áp.' },
    { name: 'Sandal Birkenstock', description: 'Đế trấu êm chân, phong cách tối giản.' },
    { name: 'Đồng hồ Casio G-Shock', description: 'Chống va đập, chống nước 200m.' },
    { name: 'Áo Polo Lacoste', description: 'Logo cá sấu đặc trưng, vải pique thoáng khí.' },
    { name: 'Bộ Suit may đo', description: 'Chất liệu len cao cấp, chuẩn doanh nhân.' },
    { name: 'Khăn choàng lụa tơ tằm', description: 'Mềm mại, họa tiết vẽ tay thủ công.' },
    { name: 'Giày cao gót Jimmy Choo', description: 'Mơ ước của mọi cô gái.' }
  ],
  28: [ // Home & Living
    { name: 'Nến thơm Jo Malone', description: 'Hương thơm tinh tế, sang trọng cho không gian.' },
    { name: 'Đèn bàn thông minh Xiaomi', description: 'Điều chỉnh độ sáng qua app, chống mỏi mắt.' },
    { name: 'Gối cao su non Liên Á', description: 'Nâng đỡ cổ vai gáy, giấc ngủ ngon hơn.' },
    { name: 'Máy lọc không khí Dyson', description: 'Lọc bụi mịn PM2.5, khử mùi hiệu quả.' },
    { name: 'Robot hút bụi Roborock S8', description: 'Lực hút cực mạnh, tự động giặt giẻ.' },
    { name: 'Bộ chăn ga lụa Tencel', description: 'Mát lạnh, mềm mịn như lụa.' },
    { name: 'Kệ sách gỗ sồi tự nhiên', description: 'Chắc chắn, màu sắc ấm cúng.' },
    { name: 'Tranh treo tường Canvas', description: 'Họa tiết trừu tượng, hiện đại.' },
    { name: 'Thảm trải sàn Thổ Nhĩ Kỳ', description: 'Họa tiết tinh xảo, chất liệu cao cấp.' },
    { name: 'Bàn làm việc thông minh', description: 'Nâng hạ độ cao tùy ý.' },
    { name: 'Ghế Ergonomic Herman Miller', description: 'Tốt nhất cho cột sống.' },
    { name: 'Nồi chiên không dầu Philips', description: 'Công nghệ Rapid Air, giòn tan không dầu.' },
    { name: 'Máy pha cà phê Delonghi', description: 'Tự động hoàn toàn, chuẩn vị Espresso.' },
    { name: 'Bộ dao làm bếp Zwilling', description: 'Thép không gỉ, sắc bén lâu dài.' },
    { name: 'Bình giữ nhiệt Thermos', description: 'Giữ nóng lạnh lên đến 24 giờ.' },
    { name: 'Gương led phòng tắm', description: 'Cảm ứng hiện đại, tích hợp sấy gương.' },
    { name: 'Hệ thống loa âm trần Bose', description: 'Âm thanh tràn ngập không gian.' },
    { name: 'Tủ lạnh Samsung Bespoke', description: 'Thiết kế thời thượng, nhiều ngăn tiện lợi.' },
    { name: 'Máy sấy quần áo LG', description: 'Công nghệ Heat Pump tiết kiệm điện.' },
    { name: 'Rèm cửa tự động Somfy', description: 'Điều khiển bằng giọng nói.' }
  ],
  29: [ // Beauty
    { name: 'Son MAC Ruby Woo', description: 'Màu đỏ cổ điển, chất son lì mịn.' },
    { name: 'Serum Estee Lauder Night Repair', description: 'Phục hồi da ban đêm thần thánh.' },
    { name: 'Kem chống nắng La Roche-Posay', description: 'Kiểm soát dầu, bảo vệ da toàn diện.' },
    { name: 'Nước hoa Chanel No.5', description: 'Biểu tượng của sự quyến rũ.' },
    { name: 'Máy rửa mặt Foreo Luna 4', description: 'Làm sạch sâu, massage nâng cơ.' },
    { name: 'Phấn nước Laneige Neo Cushion', description: 'Lớp nền mỏng nhẹ, lâu trôi.' },
    { name: 'Bảng phấn mắt Tom Ford', description: 'Màu sắc sang trọng, hạt phấn mịn.' },
    { name: 'Mặt nạ SK-II Pitera', description: 'Làm sáng da tức thì.' },
    { name: 'Sữa rửa mặt Kiehl\'s Hoa Cúc', description: 'Dịu nhẹ, sạch sâu, an toàn cho da nhạy cảm.' },
    { name: 'Kem dưỡng ẩm Clinique Jelly', description: 'Cấp nước 72 giờ, thấm nhanh.' },
    { name: 'Dầu tẩy trang Shu Uemura', description: 'Sạch mọi lớp trang điểm cứng đầu.' },
    { name: 'Nước thần làm đẹp Caudalie', description: 'Se khít lỗ chân lông, làm sáng da.' },
    { name: 'Phấn phủ bột Laura Mercier', description: 'Kiềm dầu đỉnh cao, tạo hiệu ứng mờ.' },
    { name: 'Chì kẻ mày Anastasia', description: 'Đường kẻ sắc nét, tự nhiên.' },
    { name: 'Kẹp mi Shu Uemura', description: 'Độ cong hoàn hảo, không gãy mi.' },
    { name: 'Máy sấy tóc Dyson Supersonic', description: 'Sấy nhanh, bảo vệ tóc khỏi nhiệt độ cao.' },
    { name: 'Dưỡng môi Dior Addict Lip Glow', description: 'Lên màu tự nhiên, dưỡng ẩm sâu.' },
    { name: 'Kem lót Hourglass Vanish', description: 'Che phủ lỗ chân lông cực tốt.' },
    { name: 'Mascara Maybelline Sky High', description: 'Dài và cong mi vượt trội.' },
    { name: 'Tẩy tế bào chết body Paula\'s Choice', description: 'Mềm mịn da, trị mụn lưng.' }
  ],
  30: [ // Sports
    { name: 'Giày chạy bộ Adidas Ultraboost', description: 'Đế đệm êm ái, hoàn trả năng lượng tốt.' },
    { name: 'Thảm tập Yoga Lululemon', description: 'Độ bám cực tốt, bền bỉ.' },
    { name: 'Vợt cầu lông Yonex Astrox 88D', description: 'Chuyên công, smash cực mạnh.' },
    { name: 'Đồng hồ Garmin Fenix 7', description: 'Đồng hồ thể thao đa năng chuyên nghiệp.' },
    { name: 'Xe đạp địa hình Giant ATX', description: 'Khung nhôm nhẹ, phuộc nhún êm ái.' },
    { name: 'Bình nước thể thao Lock&Lock', description: 'Dung lượng lớn, chất liệu Tritan an toàn.' },
    { name: 'Găng tay Boxing Everlast', description: 'Bảo vệ tay tốt, thoáng khí.' },
    { name: 'Dây nhảy skipping chuyên nghiệp', description: 'Tốc độ cao, dây cáp bền chắc.' },
    { name: 'Bình xịt lạnh giảm đau', description: 'Xử lý chấn thương tức thì.' },
    { name: 'Túi tập gym Nike', description: 'Nhiều ngăn tiện dụng, kháng nước.' },
    { name: 'Áo khoác chạy bộ Under Armour', description: 'Phản quang, thoáng mồ hôi.' },
    { name: 'Tạ tay điều chỉnh', description: 'Thay đổi trọng lượng từ 2-24kg.' },
    { name: 'Máy chạy bộ KingSmith R2', description: 'Gấp gọn tiện lợi, điều khiển qua app.' },
    { name: 'Gậy golf TaylorMade Stealth', description: 'Công nghệ mặt Carbon hiện đại.' },
    { name: 'Giày đá bóng Adidas Predator', description: 'Kiểm soát bóng đỉnh cao.' },
    { name: 'Vợt Tennis Wilson Pro Staff', description: 'Dòng vợt của các huyền thoại.' },
    { name: 'Quần lửng tập Gym Gymshark', description: 'Tôn dáng, co giãn 4 chiều.' },
    { name: 'Bóng đá chính hãng Molten', description: 'Tiêu chuẩn thi đấu quốc tế.' },
    { name: 'Ống bảo vệ ống đồng', description: 'Nhẹ, cứng cáp, bảo vệ tối ưu.' },
    { name: 'Kính bơi Arena Cobra Core', description: 'Chống mờ, góc nhìn rộng.' }
  ]
};

async function main() {
  console.log('Starting to update products with real data...');
  
  const allProducts = await prisma.product.findMany();
  
  let count = 0;
  for (const product of allProducts) {
    const categoryData = realData[product.categoryId];
    if (categoryData) {
      // Get a pseudo-random product from the template based on product index
      const realProduct = categoryData[count % categoryData.length];
      
      await prisma.product.update({
        where: { id: product.id },
        data: {
          name: realProduct.name,
          description: realProduct.description,
          // Randomize price slightly around common ranges if needed, 
          // or just keep original if preferred. 
          // Let's randomize a bit to make it feel more "real"
        }
      });
      count++;
    }
  }

  console.log(`Successfully updated ${count} products with real information.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

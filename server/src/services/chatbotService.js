const { ChatOllama } = require("@langchain/ollama");
const prisma = require('../config/prisma');
const { saveChatLog } = require('../utils/logger');
const { searchProducts } = require('./vectorService');

// ========== PHÁT HIỆN Ý ĐỊNH BẰNG CODE (không phụ thuộc AI) ==========

/**
 * Phát hiện khách khai vóc dáng / sở thích mặc đồ
 */
const detectBodyInfo = (msg) => {
  const patterns = [
    // Chiều cao: "cao 1m80", "cao 180cm", "cao 1.75m", "1m8", "175cm"
    /cao\s*\d/i,
    /\d+m\d{1,2}/i,
    /\d{2,3}\s*(cm|xen[- ]?ti)/i,

    // Cân nặng: "nặng 85kg", "80 ký", "cân nặng 70", "85kg"
    /nặng\s*\d/i,
    /\d+\s*(kg|kí|ký|ki[- ]?lô|cân)/i,
    /cân\s*nặng\s*\d/i,

    // Số đo: "vòng ngực 100", "vòng eo 70", "3 vòng 90-60-90"
    /vòng\s*(ngực|eo|hông|mông|1|2|3)/i,
    /\d{2,3}\s*-\s*\d{2,3}\s*-\s*\d{2,3}/,

    // Size quần áo: "size L", "mặc size 42", "cỡ XL", "mang size 40"
    /size\s*(S|M|L|XL|XXL|XXXL|\d{2})/i,
    /(mặc|mang|đi|dùng)\s*(cỡ|size|số)\s*\S+/i,

    // Dáng người: "dáng gầy", "người mập", "hơi béo", "ốm", "cân đối"
    /dáng\s*(người|gầy|mập|ốm|béo|cao|thấp|cân đối|đậm|to|nhỏ)/i,
    /(người|thể hình|body|vóc dáng)\s*(gầy|mập|ốm|béo|to|nhỏ|cân đối|đậm)/i,

    // Sở thích: "thích màu đen", "muốn màu trắng", "thích đồ rộng"
    /(thích|muốn|ưa|hay mặc)\s*(màu|đồ|kiểu|loại|style)/i,
  ];
  return patterns.some(p => p.test(msg));
};

/**
 * Trích xuất thông tin vóc dáng từ tin nhắn
 */
const extractBodyInfo = (msg) => {
  const parts = [];

  // Chiều cao — ưu tiên format "1m80" trước
  const heightCompact = msg.match(/(\d)m(\d{1,2})/i);
  const heightFull = msg.match(/cao\s*(\d+[.,]?\d*)\s*(m|met)/i);
  const heightCm = msg.match(/cao\s*(\d{2,3})\s*(cm|xen)/i);
  if (heightCompact) parts.push(`Cao ${heightCompact[1]}m${heightCompact[2]}`);
  else if (heightFull) parts.push(`Cao ${heightFull[1]}${heightFull[2]}`);
  else if (heightCm) parts.push(`Cao ${heightCm[1]}cm`);

  // Cân nặng
  const weight = msg.match(/nặng\s*(\d+[.,]?\d*)\s*(kg|kí|ký|ki[- ]?lô|cân)?/i);
  const weightAlt = msg.match(/(\d+)\s*(kg|kí|ký)/i);
  if (weight) parts.push(`Nặng ${weight[1]}kg`);
  else if (weightAlt) parts.push(`Nặng ${weightAlt[1]}kg`);

  // Số đo 3 vòng
  const measurements = msg.match(/(\d{2,3})\s*-\s*(\d{2,3})\s*-\s*(\d{2,3})/);
  if (measurements) parts.push(`3 vòng: ${measurements[0]}`);

  // Vòng cụ thể
  const bust = msg.match(/vòng\s*(ngực|1)\s*:?\s*(\d+)/i);
  const waist = msg.match(/vòng\s*(eo|2)\s*:?\s*(\d+)/i);
  const hip = msg.match(/vòng\s*(hông|mông|3)\s*:?\s*(\d+)/i);
  if (bust) parts.push(`Vòng ngực ${bust[2]}`);
  if (waist) parts.push(`Vòng eo ${waist[2]}`);
  if (hip) parts.push(`Vòng hông ${hip[2]}`);

  // Size
  const size = msg.match(/(size|cỡ|số)\s*(S|M|L|XL|XXL|XXXL|\d{2})/i);
  if (size) parts.push(`Size ${size[2]}`);

  // Dáng người
  const bodyShape = msg.match(/dáng\s*(gầy|mập|ốm|béo|cao|thấp|cân đối|đậm|to|nhỏ)/i);
  if (bodyShape) parts.push(`Dáng ${bodyShape[1]}`);

  // Màu sắc yêu thích
  const colors = msg.match(/(thích|muốn|ưa|hay mặc)\s*(?:màu\s+)?(đen|trắng|đỏ|xanh|hồng|vàng|nâu|xám|be|kem|navy|tím|cam|xanh lá|xanh dương|pastel|tối|sáng|nhạt|đậm)/i);
  if (colors) parts.push(`Thích màu ${colors[2]}`);

  // Style
  const style = msg.match(/(thích|muốn|hay mặc)\s*(đồ\s+)?(rộng|ôm|fit|oversize|basic|đơn giản|năng động|thanh lịch|sang trọng|trẻ trung|thể thao|công sở|casual)/i);
  if (style) parts.push(`Style: ${style[3] || style[2]}`);

  return parts.join(', ') || msg;
};

/**
 * Phát hiện ý định chốt đơn
 */
const detectOrderIntent = (msg) => {
  const patterns = [
    // Trực tiếp: "chốt", "mua", "đặt hàng"
    /\b(chốt|chốt đơn|đặt hàng|đặt mua|đặt đơn|order)\b/i,

    // Gián tiếp: "cho mình 1 cái", "lấy cho mình", "mua giúp"
    /(cho\s*(mình|tôi|em|t)\s*\d)/i,
    /(lấy|mua|đặt)\s*(cho\s*)?(mình|tôi|em|t|anh|chị)\b/i,
    /(lấy|mua)\s*(giúp|hộ|dùm)\b/i,

    // Xác nhận mua: "mình lấy", "t mua", "em mua luôn", "lấy luôn"
    /(mình|t|tui|tôi|em)\s*(lấy|mua|chốt|book)/i,
    /(lấy|mua|chốt)\s*(luôn|ngay|nha|nhé|đi|liền)/i,

    // Thanh toán / Ship: "thanh toán", "ship cho mình", "giao hàng"
    /\b(thanh toán|ship|giao hàng|giao cho|giao tới|giao về)\b/i,

    // Số lượng + sản phẩm: "1 cái iPhone", "2 chiếc"
    /\d+\s*(cái|chiếc|bộ|đôi|cặp|hộp|thùng|gói|chai|lọ|túi|suất)\b/i,
  ];
  return patterns.some(p => p.test(msg));
};

/**
 * Trích xuất thông tin đơn hàng từ tin nhắn
 */
const extractOrderInfo = (msg) => {
  // --- TÊN KHÁCH ---
  const namePatterns = [
    /(?:mình là|tên là|tên mình là|tôi là|em là|tên tôi là|anh là|chị là|họ tên)\s+([A-ZÀ-Ỹa-zà-ỹ\s]{2,30}?)(?:\s*[,.\-]|\s+SĐT|\s+sđt|\s+số|\s+đt|\s+ĐT|\s+đc|\s+ĐC|\s+địa|\s+phone|\s+đ\/c|$)/i,
    /(?:tên|name)\s*:\s*([A-ZÀ-Ỹa-zà-ỹ\s]{2,30}?)(?:\s*[,.\-]|$)/i,
  ];
  let customerName = null;
  for (const p of namePatterns) {
    const m = msg.match(p);
    if (m) { customerName = m[1].trim(); break; }
  }

  // --- SỐ ĐIỆN THOẠI ---
  const phonePatterns = [
    /(0\d{9,10})/,                          // 0912345678
    /(\+84\d{9,10})/,                       // +84912345678
    /(?:SĐT|sđt|số|đt|ĐT|phone|đ\/t|dt)\s*:?\s*(0\d{9,10})/i,
  ];
  let phone = null;
  for (const p of phonePatterns) {
    const m = msg.match(p);
    if (m) { phone = m[1]; break; }
  }

  // --- ĐỊA CHỈ ---
  const addressPatterns = [
    /(?:ĐC|đc|địa chỉ|dc|đ\/c|address|giao tới|giao đến|giao về|giao cho|ship tới|ship về|ship cho|ship đến|giao hàng tại|giao hàng về|ở)\s*:?\s*((?:số\s*)?\d+.*?)(?:\.|;|$)/i,
    /(?:tại|ở)\s+((?:số\s*)?\d+[^,.;]*)/i,
  ];
  let address = null;
  for (const p of addressPatterns) {
    const m = msg.match(p);
    if (m) { address = m[1].trim(); break; }
  }

  // --- SỐ LƯỢNG ---
  const qtyPatterns = [
    /(\d+)\s*(?:cái|chiếc|bộ|đôi|cặp|hộp|thùng|gói|chai|lọ|túi|suất)/i,
    /(một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười)\s*(?:cái|chiếc|bộ|đôi)/i,
  ];
  let quantity = 1;
  for (const p of qtyPatterns) {
    const m = msg.match(p);
    if (m) {
      const wordToNum = { 'một': 1, 'hai': 2, 'ba': 3, 'bốn': 4, 'năm': 5, 'sáu': 6, 'bảy': 7, 'tám': 8, 'chín': 9, 'mười': 10 };
      quantity = wordToNum[m[1].toLowerCase()] || parseInt(m[1]);
      break;
    }
  }

  return { customerName, phone, address, quantity };
};

/**
 * Thực thi tạo đơn hàng trực tiếp (không qua AI)
 */
const executeOrder = async (customerId, productId, quantity, customerName, phone, address) => {
  try {
    if (customerName && phone) {
      await prisma.customer.update({
        where: { id: customerId },
        data: { fullName: customerName, phone, address: address || '' }
      });
    }

    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product) return { success: false, msg: `Không tìm thấy sản phẩm ID ${productId}` };

    const newOrder = await prisma.order.create({
      data: {
        customerId,
        totalAmount: parseFloat(product.price) * quantity,
        status: 'confirmed',
        items: { create: [{ productId: product.id, quantity, price: parseFloat(product.price) }] }
      }
    });
    return { success: true, msg: `Đã tạo đơn hàng #${newOrder.id} cho ${product.name} (${product.price}đ x${quantity}).` };
  } catch (e) {
    return { success: false, msg: `Lỗi tạo đơn: ${e.message}` };
  }
};

// ========== LOGIC CHÍNH ==========

const triggerAIReply = async (conversationId, customerMessage) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { customer: true }
    });

    const configMap = {};
    const configs = await prisma.systemConfig.findMany();
    configs.forEach(c => configMap[c.configKey] = c.configValue);

    if (configMap['SMART_ASSIST_ENABLED'] !== 'true') return null;

    await prisma.conversation.update({ where: { id: conversationId }, data: { isTyping: true } }).catch(() => { });

    const customerId = conversation.customerId;
    let toolLogs = [];
    let toolContext = ''; // Kết quả tool sẽ được inject vào prompt cho AI

    // --- BƯỚC 1: LẤY DỮ LIỆU NỀN ---
    const pastMessages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 6
    });
    const history = pastMessages.reverse().map(m => ({
      role: m.senderType === 'customer' ? 'user' : 'assistant',
      content: m.content
    }));

    const customerNotes = await prisma.customerNote.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    const notesSummary = customerNotes.map(n => n.content).join('; ') || 'Chưa có.';

    const autoProducts = await searchProducts(customerMessage, 3);
    const productsContext = autoProducts.length > 0
      ? autoProducts.map(p => `ID:${p.id} - ${p.name} (${p.price}đ)`).join('\n')
      : 'Không tìm thấy.';

    // --- BƯỚC 2: PHÁT HIỆN Ý ĐỊNH & THỰC THI TOOL BẰNG CODE ---

    // 2a. Phát hiện khai vóc dáng → Ghi chú tự động
    if (detectBodyInfo(customerMessage)) {
      const noteContent = extractBodyInfo(customerMessage);
      await prisma.customerNote.create({
        data: { customerId, content: noteContent, staffName: 'Aura Agent' }
      });
      toolContext += `[HỆ THỐNG] Đã tự động lưu ghi chú: "${noteContent}"\n`;
      toolLogs.push({ tool: 'add_customer_note', input: noteContent, result: 'OK' });
      console.log(`[Agent] AUTO NOTE: ${noteContent}`);
    }

    // 2b. Phát hiện ý định chốt đơn → Tạo đơn tự động
    if (detectOrderIntent(customerMessage)) {
      const orderInfo = extractOrderInfo(customerMessage);

      // Tìm sản phẩm được nhắc đến
      let targetProduct = null;
      if (autoProducts.length > 0) {
        targetProduct = autoProducts[0]; // Lấy sản phẩm khớp nhất
      }

      if (targetProduct && orderInfo.customerName && orderInfo.phone) {
        const result = await executeOrder(
          customerId,
          targetProduct.id,
          orderInfo.quantity,
          orderInfo.customerName,
          orderInfo.phone,
          orderInfo.address
        );
        toolContext += `[HỆ THỐNG] ${result.msg}\n`;
        toolLogs.push({
          tool: 'create_order',
          input: JSON.stringify({ productId: targetProduct.id, ...orderInfo }),
          result: result.msg
        });
        console.log(`[Agent] AUTO ORDER: ${result.msg}`);
      } else if (targetProduct && (!orderInfo.customerName || !orderInfo.phone)) {
        toolContext += `[HỆ THỐNG] Khách muốn mua ${targetProduct.name} nhưng thiếu thông tin (Tên/SĐT/Địa chỉ). Hãy hỏi lại.\n`;
      }
    }

    if (autoProducts.length > 0) {
      toolLogs.push({ tool: 'auto_search', result: `Tìm thấy ${autoProducts.length} sản phẩm.` });
    }

    // --- BƯỚC 3: TẠO CÂU TRẢ LỜI ---
    let finalContent = '';

    // Nếu có action quan trọng → dùng template (không tin AI)
    const orderLog = toolLogs.find(t => t.tool === 'create_order');
    const noteLog = toolLogs.find(t => t.tool === 'add_customer_note');

    if (orderLog) {
      // Đã chốt đơn → trả lời xác nhận
      finalContent = `✅ ${orderLog.result}\nCảm ơn bạn đã đặt hàng! Shop sẽ liên hệ xác nhận sớm nhất ạ. Bạn cần mua thêm gì không?`;
    } else if (noteLog && !orderLog) {
      // Đã ghi nhớ thông tin → trả lời + gợi ý sản phẩm
      const productList = autoProducts.length > 0
        ? autoProducts.map(p => `- ${p.name} (${Number(p.price).toLocaleString('vi-VN')}đ)`).join('\n')
        : '';
      finalContent = `📝 Đã ghi nhớ: ${noteLog.input}`;
      if (productList) {
        finalContent += `\n\nDựa vào thông tin của bạn, shop gợi ý:\n${productList}\nBạn quan tâm sản phẩm nào ạ?`;
      } else {
        finalContent += `\nBạn đang tìm kiếm sản phẩm gì ạ?`;
      }
    } else {
      // Không có action → gọi AI viết câu trả lời
      const model = new ChatOllama({
        model: configMap.DEFAULT_MODEL || "qwen2.5:3b",
        temperature: 0.3,
        baseUrl: configMap.AI_BASE_URL?.replace('/v1', '') || "http://localhost:11434",
      });

      const prompt = `Bạn là Aura, nhân viên tư vấn bán hàng.
[Thông tin khách đã lưu]: ${notesSummary}
[Sản phẩm tìm được trong kho]:
${autoProducts.length > 0 ? autoProducts.map(p => `- ${p.name} (ID:${p.id}, giá: ${Number(p.price).toLocaleString('vi-VN')}đ)`).join('\n') : 'Không tìm thấy sản phẩm phù hợp.'}
[Lịch sử chat]:
${history.map(h => `${h.role === 'user' ? 'Khách' : 'Aura'}: ${h.content}`).join('\n')}
Khách: "${customerMessage}"

QUY TẮC BẮT BUỘC:
1. CHỈ được nhắc sản phẩm có trong [Sản phẩm tìm được trong kho]. KHÔNG tự bịa.
2. Nếu không tìm thấy sản phẩm, nói: "Hiện tại shop chưa có sản phẩm này."
3. Trả lời Tiếng Việt, ngắn gọn (2-3 câu).
4. Dựa vào [Lịch sử chat] để hiểu ngữ cảnh câu hỏi.

Aura:`;

      const response = await model.invoke(prompt);
      finalContent = response.content.replace(/^Aura:\s*/i, '').trim();
      finalContent = finalContent.replace(/\[TOOL:.*?\]/g, '').trim();
    }

    // --- BƯỚC 4: LƯU & PHẢN HỒI ---
    const botMsg = await prisma.message.create({
      data: { conversationId, content: finalContent, senderType: 'bot' }
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessage: botMsg.content, isTyping: false }
    }).catch(() => { });

    saveChatLog({ conversationId, sender: 'bot', content: botMsg.content, tools: toolLogs, customerId });

    return botMsg;
  } catch (error) {
    console.error('[Agent Error]', error);
    await prisma.conversation.update({ where: { id: conversationId }, data: { isTyping: false } }).catch(() => { });
    return null;
  }
};

module.exports = { triggerAIReply };

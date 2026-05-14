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
    /cao\s*\d+[.,]?\d*\s*(m|met)/i,
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
 * Phát hiện tin nhắn là chào hỏi hoặc tán gẫu đơn giản
 */
const detectGeneralChat = (msg) => {
  const lower = msg.toLowerCase().trim();
  const greetings = [
    'hi', 'hello', 'chào', 'xin chào', 'hey', 'alo', 'ê', 'tư vấn giúp mình', 'ad ơi', 'shop ơi',
    'xin chapf', 'xin chao', 'chao ad', 'hi shop'
  ];

  // Nếu query quá ngắn hoặc nằm trong list greeting
  if (lower.length < 15 && (greetings.some(g => lower.includes(g)) || lower.length < 3)) return true;

  const generalQuestions = ['bạn là ai', 'shop ở đâu', 'giờ mở cửa', 'liên hệ như nào'];
  if (generalQuestions.some(q => lower.includes(q))) return true;

  return false;
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
 * PREPROCESSOR: Trích xuất Search Query nguyên chất (De-noising)
 */
const extractSearchQuery = (msg) => {
  let clean = msg.toLowerCase().trim();

  // 1. Loại bỏ các từ thừa/chào hỏi (Stop words)
  const stopWords = [
    "chào", "hi", "hello", "ad", "shop", "ơi", "ạ", "cho mình hỏi",
    "giá", "nhiêu", "bao tiền", "còn", "không", "tư vấn", "giúp", "với", "bên mình"
  ];
  stopWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    clean = clean.replace(regex, '');
  });

  clean = clean.replace(/\s+/g, ' ').trim();

  // 2. Trích xuất Brand/Model bằng Regex (mạnh hơn, bắt nhiều từ)
  const productRegex = /(iphone|samsung|oppo|xiaomi|ipad|macbook|apple watch|pixel)(?:\s+(?:pro|max|ultra|plus|air|mini|fold|flip|tab|s\d+|note\d+|\d+gb|\d+))*/gi;
  const matches = clean.match(productRegex);

  if (matches) return matches[0].trim();

  // 3. Nếu không match regex, trả về chuỗi đã được clean hoặc null nếu quá ngắn
  return clean.length > 2 ? clean : null;
};

/**
 * CONTEXT BUILDER: Cung cấp dữ liệu kho hàng và kiến thức shop
 */
const buildStructuredContext = (products, isGeneralChat = false) => {
  const shopInfo = `
- Tên shop: Aura Mobile
- Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
- Giờ mở cửa: 8:00 - 21:00 (Tất cả các ngày)
- Hotline: 0988.xxx.xxx
- Chính sách: Bảo hành 12 tháng, 1 đổi 1 trong 30 ngày. Thu cũ đổi mới hỗ trợ lên đến 2 triệu.
  `;

  if (isGeneralChat) return `[THÔNG TIN SHOP]:${shopInfo}\n[TRẠNG THÁI]: Khách đang trò chuyện xã giao. Hãy trả lời tự nhiên, thân thiện.`;

  if (!products || products.length === 0) {
    return `[THÔNG TIN SHOP]:${shopInfo}\n[KHO HÀNG]: Hiện không tìm thấy sản phẩm chính xác khách yêu cầu. Hãy gợi ý khách xem các dòng iPhone/Samsung khác hoặc hỏi thêm nhu cầu.`;
  }

  const compact = products.map(p => ({
    name: p.name,
    price: `${Number(p.price).toLocaleString('vi-VN')}đ`,
    stock: p.stock > 0 ? `Còn ${p.stock} máy` : "Hết hàng",
    desc: p.content.split('|').pop().trim()
  }));

  return `[THÔNG TIN SHOP]:${shopInfo}\n[KHO HÀNG THỰC TẾ]:\n${JSON.stringify({ products: compact }, null, 2)}`;
};

/**
 * MEMORY BUILDER: Trích xuất trạng thái hội thoại (State)
 */
const getConversationState = async (customerId) => {
  const notes = await prisma.customerNote.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  return notes.map(n => n.content).join('; ') || 'Khách mới.';
};

/**
 * Phát hiện ý định chốt đơn
 */
const detectOrderIntent = (msg) => {
  const keywords = ["chốt", "mua", "đặt hàng", "lấy", "order", "giao qua", "giao đến", "sđt"];
  return keywords.some(k => msg.toLowerCase().includes(k)) && (msg.length > 10);
};

/**
 * Trích xuất thông tin đơn hàng từ tin nhắn
 */
const extractOrderInfo = (msg) => {
  const phoneRegex = /(0[3|5|7|8|9][0-9]{8})\b/g;
  const addressRegex = /(?:tại|ở|giao qua|giao đến|địa chỉ:?)\s+([^.]+)/i;
  const nameRegex = /(?:tên là|mình tên|em tên|tên)\s+([A-ZÀ-Ỹ][a-zà-ỹ]*(\s+[A-ZÀ-Ỹ][a-zà-ỹ]*)*)/u;
  const qtyRegex = /(\d+)\s*(?:máy|cái|chiếc|bộ)/i;

  const phoneMatch = msg.match(phoneRegex);
  const addressMatch = msg.match(addressRegex);
  const nameMatch = msg.match(nameRegex);
  const qtyMatch = msg.match(qtyRegex);

  let quantity = 1;
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1]);
  } else {
    // Thử tìm các từ chỉ số lượng đơn giản
    const wordToNum = { 'một': 1, 'hai': 2, 'ba': 3, 'bốn': 4, 'năm': 5 };
    for (const [word, num] of Object.entries(wordToNum)) {
      if (msg.toLowerCase().includes(word)) {
        quantity = num;
        break;
      }
    }
  }

  return {
    customerName: nameMatch ? nameMatch[1] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    address: addressMatch ? addressMatch[1].trim() : null,
    quantity
  };
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

    // --- BƯỚC 1: TIỀN XỬ LÝ (PRE-PROCESSOR) ---
    const searchQuery = extractSearchQuery(customerMessage);
    const isGeneralChat = detectGeneralChat(customerMessage);
    const customerState = await getConversationState(customerId);

    const pastMessages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 2 // Chỉ lấy 2 tin nhắn gần nhất để AI tập trung tối đa, tránh "rác" context
    });
    const history = pastMessages.reverse().map(m => ({
      role: m.senderType === 'customer' ? 'user' : 'assistant',
      content: m.content
    }));

    // --- BƯỚC 2: TRUY XUẤT (RETRIEVAL) ---
    let autoProducts = [];
    if (!isGeneralChat && searchQuery) {
      autoProducts = await searchProducts(searchQuery, 2);
      if (autoProducts.length > 0) {
        toolLogs.push({ tool: 'auto_search', input: searchQuery, result: `Found ${autoProducts.length} items` });
      }
    }
    const structuredInventory = buildStructuredContext(autoProducts, isGeneralChat);

    // --- BƯỚC 3: PHÁT HIỆN Ý ĐỊNH & TOOL (DETERMINISTIC) ---
    if (detectBodyInfo(customerMessage)) {
      const noteContent = extractBodyInfo(customerMessage);
      await prisma.customerNote.create({
        data: { customerId, content: noteContent, staffName: 'Aura Agent' }
      });
      toolLogs.push({ tool: 'add_customer_note', input: noteContent, result: 'OK' });
    }

    let orderLog = null;
    if (detectOrderIntent(customerMessage)) {
      const orderInfo = extractOrderInfo(customerMessage);
      if (orderInfo.phone && orderInfo.address) {
        orderLog = {
          tool: 'create_order',
          input: orderInfo,
          result: `Đã tạo đơn hàng cho ${orderInfo.customerName || 'Khách hàng'} - SĐT: ${orderInfo.phone}`
        };
        toolLogs.push(orderLog);

        if (autoProducts.length > 0) {
          const result = await executeOrder(customerId, autoProducts[0].id, orderInfo.quantity, orderInfo.customerName, orderInfo.phone, orderInfo.address);
          orderLog.result = result.msg;
        }
      }
    }

    // --- BƯỚC 4: TẠO CÂU TRẢ LỜI (GENERATION) ---
    let finalContent = '';
    // Đã có orderLog từ Bước 3 nếu tạo đơn thành công

    if (orderLog) {
      finalContent = `✅ ${orderLog.result}\nCảm ơn bạn đã đặt hàng! Shop sẽ liên hệ xác nhận sớm nhất ạ.`;
    } else {
      // Gọi AI với Structured Context & Strict Grounding
      const model = new ChatOllama({
        model: configMap.DEFAULT_MODEL || "qwen2.5:3b",
        temperature: 0.1, // Thấp nhất để chống hallucination
        baseUrl: configMap.AI_BASE_URL?.replace('/v1', '') || "http://localhost:11434",
      });

      const prompt = `Bạn là Aura - Trợ lý bán hàng thông minh, thân thiện và am hiểu công nghệ của Aura Mobile.

[NGỮ CẢNH HỆ THỐNG]:
${structuredInventory}

[TRẠNG THÁI KHÁCH HÀNG]: ${customerState}

[LỊCH SỬ TRÒ CHUYỆN]:
${history.map(h => `${h.role === 'user' ? 'Khách' : 'Aura'}: ${h.content}`).join('\n')}
Khách: "${customerMessage}"

HƯỚNG DẪN TRẢ LỜI:
1. TRỌNG TÂM: Chỉ trả lời đúng câu hỏi hiện tại của khách. KHÔNG nhắc lại các thông tin của câu hỏi trước đó (ví dụ: khách hỏi địa chỉ thì không được nhắc lại trà sữa hay cấu hình máy ở câu trước).
2. KHÔNG VOUCHER: Tuyệt đối không được bịa ra mã giảm giá, voucher hoặc chương trình khuyến mãi nếu không thấy trong [THÔNG TIN SHOP].
3. XƯNG HÔ: "Dạ, em" hoặc "Aura" thân thiện. Tuyệt đối không dùng "Alo".
4. NGẮN GỌN: Trả lời tối đa 3-4 câu. Không viết sớ dài.

Hãy trả lời khách hàng một cách thông minh và lôi cuốn:
Aura:`;

      const response = await model.invoke(prompt);
      finalContent = response.content
        .replace(/^Aura:\s*/gi, '')
        .replace(/^Alo,?\s*/gi, '')
        .replace(/^Dạ,?\s*Alo,?\s*/gi, 'Dạ, ')
        .trim();
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

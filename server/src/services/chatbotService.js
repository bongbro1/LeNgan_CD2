const prisma = require('../config/prisma');
const aiService = require('./aiService');
const axios = require('axios');

/**
 * Lấy ngữ cảnh AI (Kịch bản + Sản phẩm) tương tự như trong controller
 */
const getAIContext = async () => {
  const [products, configs] = await Promise.all([
    prisma.product.findMany({ where: { status: 'active' }, include: { category: true } }),
    prisma.systemConfig.findMany()
  ]);

  const configMap = {};
  configs.forEach(c => configMap[c.configKey] = c.configValue);

  const productsContext = products.map(p => 
    `- ${p.name}: ${p.price} VND, Kho: ${p.stock}, Mô tả: ${p.description || 'N/A'}`
  ).join('\n');

  // CHÍNH XÁC LẤY TỪ SYSTEM CONFIG
  const chatbotPrompt = configMap['CHATBOT_PROMPT'] || 'Bạn là nhân viên tư vấn bán hàng chuyên nghiệp.';
  
  const systemMessage = `${chatbotPrompt}

Dưới đây là danh sách sản phẩm hiện có:
${productsContext}

Quy tắc:
1. TUYỆT ĐỐI chỉ trả lời bằng tiếng Việt. Không sử dụng tiếng Trung, tiếng Anh hay bất kỳ ngôn ngữ nào khác.
2. Trả lời chính xác về giá và tồn kho dựa trên dữ liệu sản phẩm.
3. Nếu khách muốn mua, hãy lịch sự thu thập: Tên, SĐT, Địa chỉ.
4. Trả lời ngắn gọn, thân thiện và chuyên nghiệp.
5. NẾU khách yêu cầu gặp nhân viên, hãy thêm tiền tố [HAND-OFF] vào đầu câu trả lời.`;

  console.log('========= [CRITICAL DEBUG - SERVICE] AI BRAIN START =========');
  console.log('KỊCH BẢN LẤY TỪ DB (CHATBOT_PROMPT):', chatbotPrompt);
  console.log('SỐ LƯỢNG SẢN PHẨM:', products.length);
  console.log('NỘI DUNG CUỐI CÙNG GỬI AI:', systemMessage);
  console.log('========= [CRITICAL DEBUG - SERVICE] AI BRAIN END ===========');

  return { systemMessage, configMap };
};

/**
 * Tự động phản hồi tin nhắn của khách hàng
 */
const autoReply = async (conversationId, customerMessage) => {
  try {
    // 1. Kiểm tra xem hội thoại đã có nhân viên trả lời chưa
    const staffMessageCount = await prisma.message.count({
      where: {
        conversationId,
        senderType: 'staff'
      }
    });

    // Nếu đã có nhân viên rep rồi thì chatbot dừng lại
    if (staffMessageCount > 0) {
      console.log(`[Chatbot] Hội thoại ${conversationId} đã có nhân viên xử lý. Bỏ qua.`);
      return null;
    }

    // 2. Chuẩn bị ngữ cảnh AI
    const { systemMessage, configMap } = await getAIContext();

    // 2.1 Lấy lịch sử tin nhắn
    const pastMessages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 20
    });

    const history = pastMessages.map(m => ({
      role: m.senderType === 'customer' ? 'user' : 'assistant',
      content: m.content
    }));

    const messagesForAI = [
      { role: 'system', content: systemMessage },
      ...history,
      { role: 'user', content: customerMessage }
    ];

    // 3. Gọi AI
    console.log(`[Chatbot] Đang tự động trả lời cho hội thoại ${conversationId}...`);
    const aiResponse = await aiService.generateReply(messagesForAI, {
      apiKey: configMap.OPENAI_API_KEY || 'ollama',
      model: configMap.DEFAULT_MODEL || 'qwen2.5:3b',
      baseURL: configMap.AI_BASE_URL || 'http://localhost:11434/v1'
    });

    let finalContent = aiResponse.content;
    let isHandOff = false;

    // 4. Kiểm tra xem AI có yêu cầu Hand-off không
    if (finalContent.includes('[HAND-OFF]')) {
      isHandOff = true;
      finalContent = finalContent.replace('[HAND-OFF]', '').trim();
      console.log(`[Chatbot] Phát hiện yêu cầu HAND-OFF tại hội thoại ${conversationId}`);
    }

    // 5. Lưu tin nhắn của Bot
    const botMsg = await prisma.message.create({
      data: {
        conversationId,
        content: finalContent || 'Dạ, mình đợi chút nhé, nhân viên sẽ hỗ trợ mình ngay ạ!',
        senderType: 'bot'
      }
    });

    // 6. Cập nhật lastMessage cho conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessage: botMsg.content }
    });

    // 7. Ghi log
    await prisma.chatbotLog.create({
      data: {
        conversationId,
        prompt: customerMessage,
        response: botMsg.content,
        tokensUsed: aiResponse.tokensUsed || 0,
        status: isHandOff ? 'hand-off' : 'success'
      }
    });

    return botMsg;
  } catch (error) {
    console.error('[Chatbot Error] Auto reply failed:', error);
    return null;
  }
};

module.exports = { autoReply };

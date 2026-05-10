const prisma = require('../config/prisma');
const chatbotService = require('../services/chatbotService');

const send = async (req, res, next) => {
  try {
    const { conversationId, content, senderType } = req.body;
    
    const message = await prisma.message.create({
      data: {
        conversationId: parseInt(conversationId),
        content,
        senderType, // customer, staff, bot
      }
    });

    await prisma.conversation.update({
      where: { id: parseInt(conversationId) },
      data: { lastMessage: content }
    });

    // Trả về kết quả cho khách hàng ngay lập tức
    res.status(201).json(message);

    // Kích hoạt Chatbot tự động CHỈ KHI người gửi là khách hàng
    if (senderType === 'customer') {
      console.log(`[Message] Khách hàng nhắn tin tại hội thoại ${conversationId}. Kích hoạt AI...`);
      chatbotService.autoReply(parseInt(conversationId), content)
        .catch(err => console.error('[AutoReply Error]', err));
    } else {
      console.log(`[Message] Người gửi là ${senderType}. Chatbot im lặng.`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { send };

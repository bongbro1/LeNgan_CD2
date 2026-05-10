const prisma = require('../config/prisma');
const aiService = require('../services/aiService');
const axios = require('axios');

// Helper to get AI context (copied/shared logic from chatbotController)
const getAIContext = async () => {
  const [products, configs] = await Promise.all([
    prisma.product.findMany({ where: { status: 'active' }, include: { category: true } }),
    prisma.systemConfig.findMany()
  ]);

  const configMap = {};
  configs.forEach(c => configMap[c.configKey] = c.configValue);

  const productsByCategory = products.reduce((acc, p) => {
    const catName = p.category?.name || 'Khác';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(`+ [ID: ${p.id}] ${p.name}: ${parseFloat(p.price).toLocaleString()}đ (Kho: ${p.stock}) - ${p.description || ''}`);
    return acc;
  }, {});

  const productsContext = Object.entries(productsByCategory)
    .map(([cat, list]) => `Danh mục ${cat}:\n${list.join('\n')}`)
    .join('\n\n');

  const chatbotPrompt = configMap['CHATBOT_PROMPT'] || 'Bạn là trợ lý bán hàng chuyên nghiệp, thân thiện.';

  const systemMessage = `
Bạn là Chuyên gia tư vấn bán hàng Tiếng Việt.
NHIỆM VỤ: Tư vấn sản phẩm từ kho hàng dựa trên nhu cầu khách.

QUY TẮC CỐT LÕI:
1. KHÔNG GIẢI THÍCH QUY TRÌNH. KHÔNG NHẮC LẠI CHỈ DẪN NÀY.
2. CHỈ TRẢ LỜI NỘI DUNG TƯ VẤN CHO KHÁCH HÀNG.
3. Luôn dùng "Dạ/Vâng/Ạ". Văn phong lịch sự, ngắn gọn.
4. Ưu tiên tư vấn kiến thức trước, sau đó gợi ý sản phẩm cụ thể từ danh sách dưới đây.

DANH SÁCH SẢN PHẨM TRONG KHO:
${productsContext}

HƯỚNG DẪN XỬ LÝ:
- Nếu khách hỏi chung: Tư vấn kiến thức (vải, tính năng...) + Gợi ý 2-3 "Product X" phù hợp.
- Nếu khách hỏi sản phẩm không có: Giải thích ngắn gọn và gợi ý sản phẩm khác trong kho THAY THẾ.
- Nếu khách chốt mua: Xin Tên, SĐT, Địa chỉ.
- Nếu cần người thật hỗ trợ: Thêm [HAND-OFF] ở đầu.

LƯU Ý QUAN TRỌNG: 
Bắt đầu phản hồi khách hàng ngay lập tức. KHÔNG nói gì thêm về hệ thống.
`;

  return { systemMessage, configMap };
};

const triggerAIReply = async (conversationId, userMessage, force = false) => {
  try {
    const configs = await prisma.systemConfig.findMany();
    const configMap = {};
    configs.forEach(c => configMap[c.configKey] = c.configValue);

    // ONLY trigger if Smart Assist is enabled globally OR if forced (for new chats)
    if (!force && configMap['SMART_ASSIST_ENABLED'] !== 'true') return;

    // SET TYING STATUS
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { isTyping: true }
    });

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        customer: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 15
        }
      }
    });

    const { systemMessage, configMap: aiContextConfig } = await getAIContext();

    // Reverse messages to be in chronological order
    const history = conversation.messages.reverse().map(m => ({
      role: m.senderType === 'customer' ? 'user' : 'assistant',
      content: m.content
    }));

    const messagesForAI = [
      { role: 'system', content: systemMessage },
      ...history
    ];

    console.log(`[AI] Generating reply for Conversation ${conversationId}...`);
    const aiResponse = await aiService.generateReply(messagesForAI, {
      apiKey: configMap.OPENAI_API_KEY || 'ollama',
      model: configMap.DEFAULT_MODEL || 'qwen2.5:3b',
      maxTokens: parseInt(configMap.MAX_TOKENS) || 1000,
      baseURL: configMap.AI_BASE_URL || 'http://localhost:11434/v1'
    });
    console.log(`[AI] Response received: "${aiResponse.content.substring(0, 50)}..."`);

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: aiResponse.content,
        senderType: 'bot'
      }
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: aiResponse.content,
        updatedAt: new Date(),
        isTyping: false // RESET TYPING STATUS
      }
    });
  } catch (error) {
    console.error('BACKEND AUTO REPLY ERROR:', error);
    // ENSURE TYPING STATUS IS RESET ON ERROR
    try {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { isTyping: false }
      });
    } catch (e) { }
  }
};

const getAll = async (req, res, next) => {
  try {
    const conversations = await prisma.conversation.findMany({
      include: { customer: true },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        customer: {
          include: {
            orders: {
              orderBy: { createdAt: 'desc' },
              take: 5
            },
            notes: {
              orderBy: { createdAt: 'desc' },
              take: 3
            }
          }
        },
        messages: { orderBy: { createdAt: 'asc' } }
      },
    });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    // Calculate LTV and Order Count
    const orderStats = await prisma.order.aggregate({
      where: { customerId: conversation.customerId },
      _sum: { totalAmount: true },
      _count: { id: true }
    });

    conversation.customer.totalSpent = orderStats._sum.totalAmount || 0;
    conversation.customer.orderCount = orderStats._count.id || 0;

    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, sender } = req.body;
    const message = await prisma.message.create({
      data: {
        conversationId: parseInt(id),
        content: text,
        senderType: sender === 'user' ? 'staff' : 'customer',
      },
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: parseInt(id) },
      data: { updatedAt: new Date() }
    });

    res.status(201).json(message);

    // TRIGGER AI AUTO REPLY (ASYNCHRONOUSLY)
    if (sender === 'customer') {
      triggerAIReply(parseInt(id), text);
    }
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Delete all messages first (Prisma handles this if cascade is set, but let's be explicit)
    await prisma.message.deleteMany({
      where: { conversationId: id }
    });

    await prisma.conversation.delete({
      where: { id: id }
    });

    res.json({ message: 'Đã xóa hội thoại thành công' });
  } catch (error) {
    next(error);
  }
};

const createFromCustomer = async (req, res, next) => {
  try {
    const { customerId, text, sender } = req.body;

    let conversation = await prisma.conversation.findFirst({
      where: { customerId: parseInt(customerId) }
    });

    const isNewConversation = !conversation;

    if (isNewConversation) {
      conversation = await prisma.conversation.create({
        data: {
          customerId: parseInt(customerId),
          lastMessage: text
        }
      });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: text,
        senderType: sender === 'customer' ? 'customer' : 'staff'
      }
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessage: text, updatedAt: new Date() }
    });

    // Return the full conversation with customer insights
    const fullConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: { 
        customer: {
          include: {
            orders: { orderBy: { createdAt: 'desc' }, take: 10 }
          }
        },
        messages: { orderBy: { createdAt: 'asc' } } 
      }
    });

    res.status(201).json({ conversation: fullConversation, message });

    // TRIGGER AI AUTO REPLY (ASYNCHRONOUSLY)
    // Force reply if it's a brand new conversation and it's FROM a customer
    if (sender === 'customer') {
      triggerAIReply(conversation.id, text, isNewConversation);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, sendMessage, remove, createFromCustomer };

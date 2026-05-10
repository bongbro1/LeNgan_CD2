const prisma = require('../config/prisma');
const aiService = require('../services/aiService');
const axios = require('axios');

const getAIContext = async () => {
  const [products, configs] = await Promise.all([
    prisma.product.findMany({ where: { status: 'active' }, include: { category: true } }),
    prisma.systemConfig.findMany()
  ]);

  const configMap = {};
  configs.forEach(c => configMap[c.configKey] = c.configValue);

  // Group products by category for better AI understanding
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
# VAI TRÒ:
${chatbotPrompt}
Bạn là một chuyên gia tư vấn bán hàng có kiến thức sâu rộng về các lĩnh vực như Thời trang, Điện tử, Đồ thể thao, và Đồ gia dụng.

# QUY TẮC NGÔN NGỮ (BẮT BUỘC):
1. CHỈ SỬ DỤNG TIẾNG VIỆT. KHÔNG dùng tiếng Trung/Anh.
2. Văn phong: Chuyên nghiệp, am hiểu, thân thiện. Dùng "Dạ/Vâng/Ạ".

# KIẾN THỨC VÀ TƯ VẤN:
- BẠN ĐƯỢC PHÉP sử dụng kiến thức tổng quát của mình để giải thích, tư vấn cho khách về các loại hình sản phẩm, chất liệu, công dụng (ngay cả khi thông tin đó không có trong mô tả sản phẩm ở kho).
- LUÔN LUÔN tìm cách kết nối (bắc cầu) từ kiến thức chung sang các sản phẩm cụ thể đang có trong kho dưới đây.

# DANH SÁCH SẢN PHẨM TRONG KHO (Dữ liệu thực tế của cửa hàng):
${productsContext}

# QUY TRÌNH TƯ VẤN THÔNG MINH:
1. NẾU KHÁCH HỎI CHUNG (ví dụ: "Nên chọn đồ gym thế nào?"): Hãy dùng kiến thức chuyên gia để tư vấn (ví dụ: chọn vải thấm hút mồ hôi, co giãn). SAU ĐÓ, liệt kê các sản phẩm "Product X" trong danh mục Sports của kho để khách tham khảo.
2. NẾU KHÁCH HỎI CỤ THỂ SẢN PHẨM KHÔNG CÓ TRONG KHO: Đừng trả lời "không biết". Hãy giải thích qua về sản phẩm đó và gợi ý sản phẩm THAY THẾ gần nhất trong kho của mình.
   - Ví dụ: Khách hỏi "áo khoác da", kho chỉ có "Product 10 (áo thun)". Hãy nói: "Dạ hiện áo khoác da bên em đang về hàng, mình tham khảo mẫu áo thun cao cấp [Product 10] này để mặc bên trong cũng rất hợp lý ạ!"
3. CHỈ khi khách chốt mua, mới thu thập: Tên, SĐT, Địa chỉ.

# LƯU Ý:
- Nếu khách muốn gặp người thật hoặc hỏi về khiếu nại, thêm [HAND-OFF] ở đầu.
- Tuyệt đối không bịa đặt giá cả, phải dùng giá trong kho.
`;

  console.log('========= [DEBUG] AI BRAIN START =========');
  console.log('KỊCH BẢN LẤY TỪ DB (CHATBOT_PROMPT):', chatbotPrompt);
  console.log('SỐ LƯỢNG SẢN PHẨM:', products.length);
  console.log('NỘI DUNG CUỐI CÙNG GỬI AI:', systemMessage);
  console.log('========= [DEBUG] AI BRAIN END ===========');

  return { systemMessage, configMap };
};

const reply = async (req, res, next) => {
  try {
    const { message, conversationId, customerId } = req.body;

    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: parseInt(conversationId) },
        include: { customer: true, messages: { orderBy: { createdAt: 'asc' }, take: 20 } }
      });
    } else if (customerId) {
      conversation = await prisma.conversation.findFirst({
        where: { customerId: parseInt(customerId) },
        include: { customer: true, messages: { orderBy: { createdAt: 'asc' }, take: 20 } }
      });
    }

    if (!conversation) return res.status(404).json({ message: 'Conversation/Customer not found' });

    // Skip saving customer message if triggered from Dashboard with skipSave flag
    // or if the last message is already this one
    const skipSave = req.body.skipSave;
    const lastSavedMsg = conversation.messages[conversation.messages.length - 1];

    if (!skipSave && (!lastSavedMsg || lastSavedMsg.content !== message)) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: message,
          senderType: 'customer'
        }
      });
    }

    const { systemMessage, configMap } = await getAIContext();

    // Prepare message history for AI
    const history = conversation.messages.map(m => ({
      role: m.senderType === 'customer' ? 'user' : 'assistant',
      content: m.content
    }));

    const messagesForAI = [
      { role: 'system', content: systemMessage },
      ...history,
      { role: 'user', content: message }
    ];

    const aiResponse = await aiService.generateReply(messagesForAI, {
      apiKey: configMap.OPENAI_API_KEY || 'ollama',
      model: configMap.DEFAULT_MODEL || 'qwen2.5:3b',
      maxTokens: parseInt(configMap.MAX_TOKENS) || 1000,
      baseURL: configMap.AI_BASE_URL || 'http://localhost:11434/v1'
    });

    const botMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: aiResponse.content,
        senderType: 'bot'
      }
    });

    await prisma.chatbotLog.create({
      data: {
        conversationId: conversation.id,
        prompt: message,
        response: aiResponse.content,
        tokensUsed: aiResponse.tokensUsed,
        status: 'success',
        channel: conversation.customer?.socialPlatform || 'web'
      }
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessage: aiResponse.content }
    });

    res.json(botMessage);
  } catch (error) {
    next(error);
  }
};

const simulate = async (req, res, next) => {
  try {
    const { query, history = [], customPrompt } = req.body;

    const { systemMessage, configMap } = await getAIContext();

    // Use customPrompt if provided (from unsaved UI), otherwise use systemMessage from DB
    const finalSystemPrompt = customPrompt ? `${customPrompt}\n\nDưới đây là danh sách sản phẩm hiện có:\n${systemMessage.split('Dưới đây là danh sách sản phẩm hiện có:')[1]}` : systemMessage;

    const messagesForAI = [
      { role: 'system', content: finalSystemPrompt },
      ...history,
      { role: 'user', content: query }
    ];

    const aiResponse = await aiService.generateReply(messagesForAI, {
      apiKey: configMap.OPENAI_API_KEY || 'ollama',
      model: configMap.DEFAULT_MODEL || 'qwen2.5:3b',
      maxTokens: parseInt(configMap.MAX_TOKENS) || 1000,
      baseURL: configMap.AI_BASE_URL || 'http://localhost:11434/v1'
    });

    const log = await prisma.chatbotLog.create({
      data: {
        conversationId: 0,
        prompt: query,
        response: aiResponse.content,
        tokensUsed: aiResponse.tokensUsed || 0,
        status: 'success',
        channel: 'simulator'
      }
    });

    res.json({ response: aiResponse.content, log });
  } catch (error) {
    console.error('SIMULATE ERROR:', error);
    res.status(500).json({
      message: error.message || 'Lỗi không xác định khi kết nối AI'
    });
  }
};

const checkStatus = async (req, res, next) => {
  try {
    const config = await prisma.systemConfig.findFirst({
      where: { configKey: 'AI_BASE_URL' }
    });
    const baseURL = config?.configValue || 'http://localhost:11434/v1';

    let isAlive = false;
    let modelFound = false;

    try {
      const ollamaBase = baseURL.replace('/v1', '');
      const response = await axios.get(`${ollamaBase}/api/tags`, { timeout: 2000 });
      isAlive = true;
      if (response.data?.models) {
        modelFound = response.data.models.some(m => m.name.includes('qwen2.5:3b') || m.name.includes('qwen'));
      }
    } catch (e) {
      isAlive = false;
    }

    res.json({
      isAlive,
      modelFound,
      baseURL,
      provider: baseURL.includes('localhost') ? 'Ollama (Local)' : 'Cloud AI'
    });
  } catch (error) {
    next(error);
  }
};

const getConfigs = async (req, res, next) => {
  try {
    const configs = await prisma.systemConfig.findMany();
    const configMap = {};
    configs.forEach(c => configMap[c.configKey] = c.configValue);

    res.json({
      configs,
      prompt: configMap['CHATBOT_PROMPT'] || '' // Đảm bảo lấy đúng key này
    });
  } catch (error) {
    next(error);
  }
};

const updateConfigs = async (req, res, next) => {
  try {
    const { configs, prompt } = req.body;
    console.log('[DEBUG] Updating configs. Prompt length:', prompt?.length);

    if (configs && Array.isArray(configs)) {
      for (const item of configs) {
        await prisma.systemConfig.upsert({
          where: { configKey: item.configKey },
          update: { configValue: String(item.configValue) },
          create: { configKey: item.configKey, configValue: String(item.configValue) }
        });
      }
    }

    if (prompt !== undefined && prompt !== null) {
      await prisma.systemConfig.upsert({
        where: { configKey: 'CHATBOT_PROMPT' },
        update: { configValue: String(prompt) },
        create: { configKey: 'CHATBOT_PROMPT', configValue: String(prompt) }
      });
      console.log('[DEBUG] CHATBOT_PROMPT upserted successfully');
    }

    res.json({ message: 'Cập nhật cấu hình thành công' });
  } catch (error) {
    console.error('[ERROR] updateConfigs:', error);
    next(error);
  }
};

const getLogs = async (req, res, next) => {
  try {
    const logs = await prisma.chatbotLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

const getSimulatorHistory = async (req, res, next) => {
  try {
    const logs = await prisma.chatbotLog.findMany({
      where: { channel: 'simulator' },
      orderBy: { createdAt: 'asc' },
      take: 20
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = { reply, simulate, checkStatus, getConfigs, updateConfigs, getLogs, getSimulatorHistory };

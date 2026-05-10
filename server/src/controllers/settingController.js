const prisma = require('../config/prisma');

// --- PROFILE ---
const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        designation: true,
        timezone: true,
        bioAiContext: true,
        role: true,
        createdAt: true
      }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, designation, timezone, bioAiContext } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { fullName, email, designation, timezone, bioAiContext }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const bcrypt = require('bcryptjs');

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword }
    });

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    next(error);
  }
};

// --- STORE SETTINGS ---
const getStoreSettings = async (req, res, next) => {
  try {
    let store = await prisma.storeSettings.findFirst();
    if (!store) {
      // Tạo mặc định nếu chưa có
      store = await prisma.storeSettings.create({
        data: { name: 'My Social Store', currency: 'VND', language: 'vi' }
      });
    }
    res.json(store);
  } catch (error) {
    next(error);
  }
};

const updateStoreSettings = async (req, res, next) => {
  try {
    const { name, phone, address, currency, language } = req.body;
    const store = await prisma.storeSettings.findFirst();
    const updatedStore = await prisma.storeSettings.update({
      where: { id: store.id },
      data: { name, phone, address, currency, language }
    });
    res.json(updatedStore);
  } catch (error) {
    next(error);
  }
};

// --- AI CONFIG ---
const getAIConfig = async (req, res, next) => {
  try {
    const configs = await prisma.systemConfig.findMany();
    // Chuyển mảng thành object để frontend dễ dùng
    const configMap = {};
    configs.forEach(c => {
      configMap[c.configKey] = c.configValue;
    });
    res.json(configMap);
  } catch (error) {
    next(error);
  }
};

const updateAIConfig = async (req, res, next) => {
  try {
    const { OPENAI_API_KEY, DEFAULT_MODEL, MAX_TOKENS, AI_BASE_URL } = req.body;

    const updates = [
      prisma.systemConfig.upsert({
        where: { configKey: 'OPENAI_API_KEY' },
        update: { configValue: OPENAI_API_KEY || '' },
        create: { configKey: 'OPENAI_API_KEY', configValue: OPENAI_API_KEY || '', isSensitive: true }
      }),
      prisma.systemConfig.upsert({
        where: { configKey: 'DEFAULT_MODEL' },
        update: { configValue: DEFAULT_MODEL || 'qwen2.5:3b' },
        create: { configKey: 'DEFAULT_MODEL', configValue: DEFAULT_MODEL || 'qwen2.5:3b' }
      }),
      prisma.systemConfig.upsert({
        where: { configKey: 'MAX_TOKENS' },
        update: { configValue: (MAX_TOKENS || 4096).toString() },
        create: { configKey: 'MAX_TOKENS', configValue: (MAX_TOKENS || 4096).toString() }
      }),
      prisma.systemConfig.upsert({
        where: { configKey: 'AI_BASE_URL' },
        update: { configValue: AI_BASE_URL || 'http://localhost:11434/v1' },
        create: { configKey: 'AI_BASE_URL', configValue: AI_BASE_URL || 'http://localhost:11434/v1' }
      })
    ];

    await Promise.all(updates);
    res.json({ message: 'AI Config updated successfully' });
  } catch (error) {
    next(error);
  }
};

const testAI = async (req, res, next) => {
  try {
    const { AI_BASE_URL, DEFAULT_MODEL, OPENAI_API_KEY } = req.body;
    const aiService = require('../services/aiService');

    const result = await aiService.generateReply(
      "Hãy trả lời duy nhất từ 'OK'",
      "Kiểm tra kết nối hệ thống.",
      {
        apiKey: OPENAI_API_KEY || 'ollama',
        model: DEFAULT_MODEL || 'qwen2.5:3b',
        baseURL: AI_BASE_URL || 'http://localhost:11434/v1',
        maxTokens: 10
      }
    );

    res.json({ success: true, response: result.content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- SOCIAL ---
const getSocialIntegrations = async (req, res, next) => {
  try {
    const integrations = await prisma.socialIntegration.findMany();
    res.json(integrations);
  } catch (error) {
    next(error);
  }
};

const getConfigs = async (req, res, next) => {
  try {
    const configs = await prisma.systemConfig.findMany();
    res.json(configs);
  } catch (error) {
    next(error);
  }
};

const updateConfigByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const config = await prisma.systemConfig.upsert({
      where: { configKey: key },
      update: { configValue: value },
      create: { configKey: key, configValue: value }
    });
    res.json(config);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  getStoreSettings,
  updateStoreSettings,
  getAIConfig,
  updateAIConfig,
  testAI,
  getSocialIntegrations,
  getConfigs,
  updateConfigByKey
};

const prisma = require('../config/prisma');

const getLogs = async (req, res, next) => {
  try {
    const logs = await prisma.chatbotLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to last 50 for performance
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLogs };

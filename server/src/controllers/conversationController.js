const prisma = require('../config/prisma');
const aiService = require('../services/aiService');
const axios = require('axios');
const { saveChatLog } = require('../utils/logger');
const { triggerAIReply } = require('../services/chatbotService');

const getAll = async (req, res, next) => {
  try {
    const conversations = await prisma.conversation.findMany({
      include: { 
        customer: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
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
    const { text, sender, customerId } = req.body;

    let convId = parseInt(id);

    // Kiểm tra sự tồn tại của hội thoại
    let conversation = await prisma.conversation.findUnique({
      where: { id: convId }
    });

    // Nếu chưa có (hoặc đã bị xóa), nhưng có customerId thì tạo mới luôn
    if (!conversation && customerId) {
      console.log(`[Backend] Conversation ${id} not found, creating new for customer ${customerId}`);
      conversation = await prisma.conversation.create({
        data: {
          customerId: parseInt(customerId),
          lastMessage: text
        }
      });
      convId = conversation.id;
    }

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found and no customerId provided' });
    }

    const senderType = ['staff', 'admin', 'bot'].includes(sender) ? sender : (sender === 'user' ? 'staff' : 'customer');

    const message = await prisma.message.create({
      data: {
        conversationId: convId,
        content: text,
        senderType: senderType,
      },
    });

    // Update conversation updatedAt
    if (convId) {
      await prisma.conversation.update({
        where: { id: convId },
        data: { updatedAt: new Date(), lastMessage: text }
      }).catch(err => console.error('[Backend Error] Failed to update conversation time:', err.message));
    }

    res.status(201).json({ message, conversation });

    saveChatLog({
      conversationId: convId,
      sender: sender === 'user' ? 'staff' : 'customer',
      content: text,
      customerId: conversation.customerId
    });

    // TRIGGER AI AUTO REPLY (ASYNCHRONOUSLY)
    if (sender === 'customer') {
      triggerAIReply(convId, text);
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

    const senderType = ['staff', 'admin', 'bot'].includes(sender) ? sender : (sender === 'customer' ? 'customer' : 'staff');

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: text,
        senderType: senderType
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

    saveChatLog({
      conversationId: conversation.id,
      sender: sender === 'customer' ? 'customer' : 'staff',
      content: text,
      customerId: parseInt(customerId)
    });

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

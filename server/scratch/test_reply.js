const { triggerAIReply } = require('../src/services/chatbotService');
const prisma = require('../src/config/prisma');

async function testReply() {
  const conversationId = 125;
  const message = "Bên mình còn iPhone 15 128GB không shop?";
  
  console.log(`Testing reply for: "${message}"`);
  try {
    const reply = await triggerAIReply(conversationId, message);
    if (reply) {
      console.log('Bot Reply:', reply.content);
    } else {
      console.log('Bot Reply: null');
    }
  } catch (e) {
    console.error('Error in testReply:', e);
  }
}

testReply().finally(() => prisma.$disconnect());

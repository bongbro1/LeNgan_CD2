const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing data...');
  // Delete in order to respect foreign keys
  await prisma.chatbotLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.socialIntegration.deleteMany();
  await prisma.systemConfig.deleteMany();
  await prisma.storeSettings.deleteMany();
  // Keep users or delete if you want to reset admin too
  // await prisma.user.deleteMany(); 

  console.log('Seeding data...');

  // 1. Users
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      fullName: 'Alexander Sterling',
      email: 'alex@socialsales.ai',
      designation: 'Sales Operations Lead',
      timezone: 'Asia/Ho_Chi_Minh',
      bioAiContext: 'Lead sales strategist focusing on high-ticket social commerce. This bio is used as context for the AI Chatbot khi cá nhân hóa tương tác.',
      role: 'admin',
    },
  });

  // 2. Store Settings
  await prisma.storeSettings.create({
    data: {
      name: 'Social Sales Premium Store',
      phone: '+84 987 654 321',
      address: '123 AI Boulevard, Tech District, Ho Chi Minh City',
      currency: 'VND',
      language: 'vi'
    }
  });

  // 3. System Config (AI)
  await prisma.systemConfig.createMany({
    data: [
      { configKey: 'OPENAI_API_KEY', configValue: 'ollama', description: 'Main OpenAI Key', isSensitive: true },
      { configKey: 'DEFAULT_MODEL', configValue: 'qwen2.5:3b', description: 'Recommended AI Model' },
      { configKey: 'MAX_TOKENS', configValue: '4096', description: 'Max token overhead' },
      { configKey: 'AI_BASE_URL', configValue: 'http://localhost:11434/v1', description: 'Ollama/Local AI URL' },
      { configKey: 'SMART_ASSIST_ENABLED', configValue: 'true', description: 'Toggle AI Auto Reply globally' }
    ]
  });

  // 4. Social Integrations
  await prisma.socialIntegration.createMany({
    data: [
      { platform: 'facebook', platformName: 'FB Messenger', status: 'connected', accountInfo: 'Social Sales Page' },
      { platform: 'zalo', platformName: 'Zalo OA', status: 'connected', accountInfo: 'Social Sales Official' },
      { platform: 'instagram', platformName: 'Instagram Direct', status: 'disconnected' }
    ]
  });

  // 5. Categories
  const categories = [
    { name: 'Electronics', description: 'Gadgets and devices' },
    { name: 'Fashion', description: 'Clothing and accessories' },
    { name: 'Home & Living', description: 'Furniture and decor' },
    { name: 'Beauty', description: 'Cosmetics and skincare' },
    { name: 'Sports', description: 'Fitness and outdoor gear' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  const createdCategories = await prisma.category.findMany();

  // 6. Products (100)
  console.log('Creating 100 products...');
  for (let i = 1; i <= 100; i++) {
    const category = createdCategories[Math.floor(Math.random() * createdCategories.length)];
    await prisma.product.create({
      data: {
        name: `Product ${i}`,
        description: `Description for product ${i}. This is a high quality item.`,
        price: 100000 + Math.floor(Math.random() * 900000),
        stock: Math.floor(Math.random() * 50),
        categoryId: category.id,
        imageUrl: `https://picsum.photos/seed/prod${i}/400/400`,
        status: 'active'
      },
    });
  }

  // 7. Customers (100)
  console.log('Creating 100 customers...');
  const customersData = [];
  for (let i = 1; i <= 100; i++) {
    const customer = await prisma.customer.create({
      data: {
        fullName: `Customer ${i}`,
        phone: `090${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
        email: `customer${i}@example.com`,
        address: `${i} Le Loi St, District 1, HCMC`,
        socialPlatform: i % 2 === 0 ? 'facebook' : 'zalo',
        socialId: `social_${i}`
      },
    });
    customersData.push(customer);
  }

  // 8. Orders (200)
  console.log('Creating 200 orders...');
  const products = await prisma.product.findMany();
  for (let i = 1; i <= 200; i++) {
    const customer = customersData[Math.floor(Math.random() * customersData.length)];
    const orderProducts = [];
    const numItems = 1 + Math.floor(Math.random() * 3);
    let total = 0;

    for (let j = 0; j < numItems; j++) {
      const prod = products[Math.floor(Math.random() * products.length)];
      const qty = 1 + Math.floor(Math.random() * 2);
      const price = parseFloat(prod.price);
      orderProducts.push({
        productId: prod.id,
        quantity: qty,
        price: price
      });
      total += price * qty;
    }

    // Random date within last 30 days
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    randomDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    await prisma.order.create({
      data: {
        customerId: customer.id,
        totalAmount: total,
        status: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'][Math.floor(Math.random() * 5)],
        createdAt: randomDate,
        items: {
          create: orderProducts
        }
      },
    });
  }

  // 9. Conversations, Messages & Logs
  console.log('Creating sample conversations & logs...');
  for (let i = 0; i < 20; i++) {
    const customer = customersData[i];

    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 7)); // Within last week

    const conversation = await prisma.conversation.create({
      data: {
        customerId: customer.id,
        lastMessage: 'I need help with my order.',
        updatedAt: randomDate
      }
    });

    await prisma.message.createMany({
      data: [
        { conversationId: conversation.id, senderType: 'customer', content: 'Hi, is this available?', createdAt: randomDate },
        { conversationId: conversation.id, senderType: 'bot', content: 'Yes, it is in stock!', createdAt: randomDate },
      ]
    });

    // Detailed Logs for BotLogs Page
    await prisma.chatbotLog.create({
      data: {
        conversationId: conversation.id,
        prompt: 'Hi, is this available?',
        response: 'Yes, it is in stock!',
        tokensUsed: 150 + Math.floor(Math.random() * 500),
        status: i % 3 === 0 ? 'hand-off' : 'success',
        channel: customer.socialPlatform,
        createdAt: randomDate
      }
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

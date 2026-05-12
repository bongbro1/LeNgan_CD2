const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const orderCount = await prisma.order.count();
  const convCount = await prisma.conversation.count();
  const productCount = await prisma.product.count();
  const customerCount = await prisma.customer.count();

  console.log({
    orderCount,
    convCount,
    productCount,
    customerCount
  });

  if (orderCount > 0) {
    const latestOrder = await prisma.order.findFirst({ include: { customer: true }, orderBy: { createdAt: 'desc' } });
    console.log('Latest Order:', latestOrder);
  }

  if (convCount > 0) {
    const latestConv = await prisma.conversation.findFirst({ include: { customer: true }, orderBy: { updatedAt: 'desc' } });
    console.log('Latest Conv:', latestConv);
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());

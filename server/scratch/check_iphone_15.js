const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({
    where: { name: { contains: 'iPhone 15' } },
    select: { name: true, price: true, description: true }
  });
  console.log(JSON.stringify(products, null, 2));
}

check().finally(() => prisma.$disconnect());

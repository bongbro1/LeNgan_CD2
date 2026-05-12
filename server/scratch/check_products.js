const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({ where: { status: 'active' } });
  console.log('ACTIVE PRODUCTS:', products.length);
  products.forEach(p => console.log(`- ${p.name} (ID: ${p.id}, Stock: ${p.stock})`));
  process.exit(0);
}

check();

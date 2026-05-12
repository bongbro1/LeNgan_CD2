const prisma = require('../config/prisma');

const getReports = async (req, res, next) => {
  try {
    const { range = 'year' } = req.query;
    let dateFilter = {};
    const now = new Date();

    // Khai báo biến trả về cho biểu đồ
    let revenueHistory = [];
    let labels = [];

    // 1. Logic lọc thời gian và tính toán doanh thu linh hoạt
    if (range === 'today') {
      dateFilter = {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      };
      const hourlyData = await prisma.$queryRaw`
        SELECT HOUR(createdAt) as hour, SUM(totalAmount) as total
        FROM \`Order\`
        WHERE DATE(createdAt) = CURDATE()
        GROUP BY HOUR(createdAt)
        ORDER BY hour ASC
      `;
      revenueHistory = Array(24).fill(0);
      hourlyData.forEach(d => revenueHistory[d.hour] = parseFloat(d.total));
      labels = Array.from({ length: 24 }, (_, i) => `${i}h`);

    } else if (range === 'week') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
      dateFilter = { createdAt: { gte: new Date(startOfWeek.setHours(0, 0, 0, 0)) } };

      const weeklyData = await prisma.$queryRaw`
        SELECT DAYOFWEEK(createdAt) as day, SUM(totalAmount) as total
        FROM \`Order\`
        WHERE YEARWEEK(createdAt, 1) = YEARWEEK(CURDATE(), 1)
        GROUP BY DAYOFWEEK(createdAt)
      `;
      revenueHistory = Array(7).fill(0);
      weeklyData.forEach(d => {
        const idx = d.day === 1 ? 6 : d.day - 2;
        revenueHistory[idx] = parseFloat(d.total);
      });
      labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    } else if (range === 'month') {
      dateFilter = { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } };

      const dailyData = await prisma.$queryRaw`
        SELECT DAY(createdAt) as day, SUM(totalAmount) as total
        FROM \`Order\`
        WHERE MONTH(createdAt) = MONTH(CURDATE()) AND YEAR(createdAt) = YEAR(CURDATE())
        GROUP BY DAY(createdAt)
      `;
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      revenueHistory = Array(daysInMonth).fill(0);
      dailyData.forEach(d => revenueHistory[d.day - 1] = parseFloat(d.total));
      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

    } else {
      // range = 'year' hoặc 'all'
      dateFilter = range === 'year' ? { createdAt: { gte: new Date(now.getFullYear(), 0, 1) } } : {};

      const monthlyData = await prisma.$queryRaw`
        SELECT MONTH(createdAt) as month, SUM(totalAmount) as total
        FROM \`Order\`
        WHERE YEAR(createdAt) = YEAR(CURDATE())
        GROUP BY MONTH(createdAt)
        ORDER BY month ASC
      `;
      revenueHistory = Array(12).fill(0);
      monthlyData.forEach(d => revenueHistory[d.month - 1] = parseFloat(d.total));
      labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    }

    // 2. Các truy vấn khác (Top sản phẩm, khách hàng, AI)
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: true
    });

    const topProductsRaw = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: dateFilter },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });

    const enrichedProducts = await Promise.all(topProductsRaw.map(async (p) => {
      const product = await prisma.product.findUnique({
        where: { id: p.productId },
        include: { category: true }
      });
      return {
        ...p,
        name: product?.name || 'Sản phẩm đã xóa',
        imageUrl: product?.imageUrl,
        category: product?.category?.name || 'Chưa phân loại'
      };
    }));

    const topCustomersRaw = await prisma.order.groupBy({
      by: ['customerId'],
      where: dateFilter,
      _sum: { totalAmount: true },
      _count: { id: true },
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: 5
    });

    const enrichedCustomers = await Promise.all(topCustomersRaw.map(async (c) => {
      const customer = await prisma.customer.findUnique({ where: { id: c.customerId } });
      return {
        ...c,
        fullName: customer?.fullName || 'Khách vãng lai',
        email: customer?.email || 'N/A',
        imageUrl: customer?.imageUrl
      };
    }));

    const totalAiRequests = await prisma.chatbotLog.count({ where: dateFilter });
    const aiStats = await prisma.chatbotLog.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: true
    });
    const handOffCount = aiStats.find(s => s.status === 'hand-off')?._count || 0;

    const allProducts = await prisma.product.findMany();
    const inventoryStats = {
      totalValue: allProducts.reduce((acc, p) => acc + (p.price * p.stock), 0),
      totalItems: allProducts.reduce((acc, p) => acc + p.stock, 0),
      lowStock: await prisma.product.findMany({
        where: { stock: { lt: 10 } },
        include: { category: true },
        take: 5,
        orderBy: { stock: 'asc' }
      })
    };

    const platformDistribution = await prisma.customer.groupBy({
      by: ['socialPlatform'],
      _count: true
    });

    res.json({
      range,
      ordersByStatus,
      topProducts: enrichedProducts,
      topCustomers: enrichedCustomers,
      revenueHistory,
      labels,
      aiPerformance: {
        totalRequests: totalAiRequests,
        handOffRate: totalAiRequests > 0 ? Math.round((handOffCount / totalAiRequests) * 100) : 0
      },
      inventoryStats,
      platformDistribution
    });
  } catch (error) {
    console.error('Report Error:', error);
    next(error);
  }
};

module.exports = { getReports };

const prisma = require('../config/prisma');

const getStats = async (req, res, next) => {
  try {
    const { range } = req.query;
    let startDate = new Date();

    if (range === 'Hôm nay') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '7 ngày qua') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === '30 ngày qua') {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate.setDate(startDate.getDate() - 30); // Default
    }

    const [totalProducts, totalCustomers, totalOrders, orders] = await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.count({ where: { createdAt: { gte: startDate } } }),
      prisma.order.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    // Calculate revenue and status distribution
    const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

    const statusMap = {};
    orders.forEach(o => {
      statusMap[o.status] = (statusMap[o.status] || 0) + 1;
    });
    const ordersByStatus = Object.keys(statusMap).map(status => ({ status, _count: statusMap[status] }));

    // Generate daily revenue trends for the chart
    const dailyRevenue = {};
    orders.filter(o => o.status === 'completed').forEach(o => {
      const date = o.createdAt.toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + parseFloat(o.totalAmount);
    });

    const revenueTrends = Object.keys(dailyRevenue).map(date => ({
      date,
      revenue: dailyRevenue[date]
    }));

    const activeConversations = await prisma.conversation.count({
      where: { updatedAt: { gte: new Date(new Date() - 24 * 60 * 60 * 1000) } }
    });

    res.json({
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      activeConversations,
      revenueTrends
    });
  } catch (error) {
    next(error);
  }
};

const globalSearch = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.json({ customers: [], orders: [] });

    const [customers, orders] = await Promise.all([
      prisma.customer.findMany({
        where: {
          OR: [
            { fullName: { contains: query } },
            { phone: { contains: query } },
            { email: { contains: query } }
          ]
        },
        take: 5
      }),
      // Use raw query to search ID with LIKE since it's an Integer
      prisma.$queryRaw`
        SELECT o.*, c.fullName as customerName 
        FROM \`Order\` o
        LEFT JOIN Customer c ON o.customerId = c.id
        WHERE CAST(o.id AS CHAR) LIKE ${'%' + query + '%'}
        LIMIT 5
      `
    ]);

    // Format orders for frontend (as $queryRaw returns plain objects)
    const formattedOrders = orders.map(o => ({
      ...o,
      customer: { fullName: o.customerName }
    }));

    res.json({ customers, orders: formattedOrders });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, globalSearch };

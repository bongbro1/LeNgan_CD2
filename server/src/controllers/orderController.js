const prisma = require('../config/prisma');

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, search, timeRange, sortBy, sortOrder } = req.query;

    // Build filter conditions
    let where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { id: isNaN(parseInt(search)) ? undefined : parseInt(search) },
        { customer: { fullName: { contains: search } } }
      ].filter(condition => condition.id !== undefined || condition.customer !== undefined);
    }

    if (timeRange) {
      const now = new Date();
      let startDate = new Date();
      if (timeRange === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (timeRange === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (timeRange === 'month') {
        startDate.setMonth(now.getMonth());
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
      }
      where.createdAt = { gte: startDate };
    }

    // Build Sort conditions
    let orderBy = { createdAt: 'desc' };
    if (sortBy) {
      if (sortBy === 'customer') {
        orderBy = { customer: { fullName: sortOrder || 'asc' } };
      } else {
        orderBy = { [sortBy]: sortOrder || 'asc' };
      }
    }

    const total = await prisma.order.count({ where });

    // Calculate global stats for current filters
    const stats = await prisma.order.groupBy({
      by: ['status'],
      where,
      _count: { id: true },
      _sum: { totalAmount: true }
    });

    const totalPending = stats.find(s => s.status === 'pending')?._count.id || 0;
    const totalShipping = stats.find(s => s.status === 'shipping')?._count.id || 0;
    const completedStats = stats.find(s => s.status === 'completed');
    const totalRevenue = completedStats?._sum.totalAmount || 0;

    const orders = await prisma.order.findMany({
      where,
      include: { customer: true },
      orderBy: orderBy,
      skip: skip,
      take: limit,
    });

    res.json({
      orders,
      stats: {
        totalPending,
        totalShipping,
        totalRevenue
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        customer: true,
        items: { include: { product: true } }
      },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { customerId, items } = req.body;

    // items: [{ productId, quantity, price }]
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    const order = await prisma.order.create({
      data: {
        customerId: parseInt(customerId),
        totalAmount,
        status: 'pending',
        items: {
          create: items.map(item => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price)
          }))
        }
      },
      include: { items: true }
    });

    // Update stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: parseInt(item.productId) },
        data: { stock: { decrement: parseInt(item.quantity) } }
      });
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // First, delete order items (due to foreign key constraint)
    await prisma.orderItem.deleteMany({
      where: { orderId: id }
    });

    // Then delete the order
    await prisma.order.delete({
      where: { id: id },
    });

    res.json({ message: 'Đã xóa đơn hàng thành công' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, create, updateStatus, remove };

const prisma = require('../config/prisma');

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, socialPlatform } = req.query;

    let where = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (socialPlatform) {
      where.socialPlatform = socialPlatform;
    }

    const total = await prisma.customer.count({ where });
    const customers = await prisma.customer.findMany({
      where,
      include: {
        orders: {
          select: { totalAmount: true }
        },
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: limit,
    });

    // Tính tổng chi tiêu cho mỗi khách hàng
    const customersWithSpend = customers.map(customer => {
      const totalSpend = customer.orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      const { orders, ...customerData } = customer; // Loại bỏ mảng orders để giảm kích thước response
      return {
        ...customerData,
        totalSpend
      };
    });

    res.json({
      customers: customersWithSpend,
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
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { 
        orders: {
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: 'desc' }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        conversations: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' }
            }
          },
          orderBy: { updatedAt: 'desc' },
          take: 1
        }
      },
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { fullName, phone, email, address, socialPlatform, socialId } = req.body;
    const customer = await prisma.customer.create({
      data: { fullName, phone, email, address, socialPlatform, socialId },
    });
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { fullName, phone, email, address, socialPlatform, socialId } = req.body;
    const customer = await prisma.customer.update({
      where: { id: parseInt(req.params.id) },
      data: { fullName, phone, email, address, socialPlatform, socialId },
    });
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await prisma.customer.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    next(error);
  }
};

const updateRank = async (req, res, next) => {
  try {
    const { rank } = req.body;
    const customer = await prisma.customer.update({
      where: { id: parseInt(req.params.id) },
      data: { rank },
    });
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

const addNote = async (req, res, next) => {
  try {
    const { content, staffName } = req.body;
    const note = await prisma.customerNote.create({
      data: {
        customerId: parseInt(req.params.id),
        content,
        staffName: staffName || 'Nhân viên'
      },
    });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, create, update, remove, updateRank, addNote };

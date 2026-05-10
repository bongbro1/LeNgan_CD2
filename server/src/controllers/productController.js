const prisma = require('../config/prisma');

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { categoryId, status, sortBy, sortOrder } = req.query;
    
    // Sắp xếp động
    let orderBy = { createdAt: 'desc' }; // Mặc định
    if (sortBy) {
      orderBy = { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' };
    }

    // Xây dựng điều kiện lọc
    let where = {};
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }
    if (status) {
      if (status === 'out_of_stock') {
        where.stock = { lte: 0 };
      } else if (status === 'active') {
        where.stock = { gt: 0 };
      }
    }

    // Lấy tổng số sản phẩm thỏa mãn điều kiện lọc
    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: orderBy,
      skip: skip,
      take: limit,
    });

    res.json({
      products,
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
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId, status } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Tên, Giá và Danh mục sản phẩm.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        imageUrl,
        categoryId: parseInt(categoryId),
        status: status || 'active',
      },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId, status } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        imageUrl,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        status,
      },
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Kiểm tra xem sản phẩm có nằm trong đơn hàng nào không
    const orderItemCount = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderItemCount > 0) {
      return res.status(400).json({
        message: 'Không thể xóa sản phẩm này vì nó đã có trong lịch sử đơn hàng. Hãy chuyển trạng thái sang "Ngừng kinh doanh" thay vì xóa.'
      });
    }

    await prisma.product.delete({
      where: { id },
    });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, create, update, remove };

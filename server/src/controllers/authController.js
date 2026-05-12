const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    
    if (!user) {
      return res.status(404).json({ message: 'Tên đăng nhập không tồn tại trong hệ thống.' });
    }

    res.json({ 
      message: 'Xác thực thành công. Vui lòng nhập mật khẩu mới cho tài khoản ' + username,
      canReset: true,
      username: username
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { username, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { username },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Mật khẩu đã được cập nhật thành công!' });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe, forgotPassword, resetPassword };

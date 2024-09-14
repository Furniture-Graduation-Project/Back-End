import jwt from 'jsonwebtoken';
import Employee from '../models/employee';

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: 'Chưa xác thực - Không có Token' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res
        .status(401)
        .json({ error: 'Chưa xác thực - Token không hợp lệ' });
    }
    const user = await Employee.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tìm thấy' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Lỗi trong middleware protectRoute:', error.message);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

export default protectRoute;

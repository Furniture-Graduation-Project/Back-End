const protectAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: 'Chưa xác thực - Không có thông tin của nhân viên' });
    }
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Cấm truy cập - Quyền truy cập không đủ' });
    }
    next();
  } catch (error) {
    console.error('Lỗi trong middleware protectAdmin:', error.message);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};
export default protectAdmin;

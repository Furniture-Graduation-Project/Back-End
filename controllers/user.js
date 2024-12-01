import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';

const UserController = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const users = await User.find()
        .skip(skip)
        .limit(limit)
        .select('-password')
        .sort({ createdAt: -1 });
      const totalData = await User.countDocuments();
      if (!users) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không có người dùng nào !' });
      }

      return res.status(StatusCodes.OK).json({
        data: users,
        totalPage: Math.ceil(totalData / limit),
        totalData: totalData,
        message: 'Lấy danh sách người dùng thành công.',
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Người dùng không tồn tại !' });
      }

      return res
        .status(StatusCodes.OK)
        .json({ data: user, message: 'Lấy người dùng thàng công.' });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Người dùng không tồn tại !' });
      }
      return res.status(StatusCodes.OK).json({ message: 'Xóa thành công !' });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
};

export default UserController;

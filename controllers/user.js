import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';

const UserController = {
  getAll: async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });
      if (!users) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không có người dùng nào !' });
      }

      return res.status(StatusCodes.OK).json({ data: users });
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

      return res.status(StatusCodes.OK).json({ data: user });
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

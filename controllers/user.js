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

  countUser: async (req, res) => {
    try {
      const { period } = req.query;

      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const startOfThisWeek = new Date(
        now.setDate(now.getDate() - now.getDay()),
      );
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfThisYear = new Date(now.getFullYear(), 0, 1);
      const startOfYesterday = new Date(startOfToday);

      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

      const startOfLastMonth = new Date(startOfThisMonth);
      startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

      const startOfLastYear = new Date(startOfThisYear);
      startOfLastYear.setFullYear(startOfLastYear.getFullYear() - 1);
      let filterToday = {};
      let filterPrevious = {};
      if (period === 'day') {
        filterToday = { createdAt: { $gte: startOfToday } };
        filterPrevious = {
          createdAt: { $gte: startOfYesterday, $lt: startOfToday },
        };
      } else if (period === 'week') {
        const endOfLastWeek = new Date(startOfThisWeek);
        filterToday = { createdAt: { $gte: startOfThisWeek } };
        filterPrevious = {
          createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek },
        };
      } else if (period === 'month') {
        filterToday = { createdAt: { $gte: startOfThisMonth } };
        filterPrevious = {
          createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
        };
      } else if (period === 'year') {
        filterToday = { createdAt: { $gte: startOfThisYear } };
        filterPrevious = {
          createdAt: { $gte: startOfLastYear, $lt: startOfThisYear },
        };
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message:
            'Vui lòng cung cấp period là "day", "week", "month", hoặc "year".',
        });
      }

      const countToday = await User.countDocuments(filterToday);
      const countPrevious = await User.countDocuments(filterPrevious);
      return res.status(StatusCodes.OK).json({
        current: countToday,
        previous: countPrevious,
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

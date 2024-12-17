import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createToken } from "../utils/token.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { sendOtpEmail } from "../services/emailOtp.js";

dotenv.config();

const UserController = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const users = await User.find()
        .skip(skip)
        .limit(limit)
        .select("-password")
        .sort({ createdAt: -1 });
      const totalData = await User.countDocuments();
      if (!users) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Không có người dùng nào !" });
      }

      return res.status(StatusCodes.OK).json({
        data: users,
        totalPage: Math.ceil(totalData / limit),
        totalData: totalData,
        message: "Lấy danh sách người dùng thành công.",
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
        now.setDate(now.getDate() - now.getDay())
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
      if (period === "day") {
        filterToday = { createdAt: { $gte: startOfToday } };
        filterPrevious = {
          createdAt: { $gte: startOfYesterday, $lt: startOfToday },
        };
      } else if (period === "week") {
        const endOfLastWeek = new Date(startOfThisWeek);
        filterToday = { createdAt: { $gte: startOfThisWeek } };
        filterPrevious = {
          createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek },
        };
      } else if (period === "month") {
        filterToday = { createdAt: { $gte: startOfThisMonth } };
        filterPrevious = {
          createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
        };
      } else if (period === "year") {
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
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Người dùng không tồn tại !" });
      }

      return res
        .status(StatusCodes.OK)
        .json({ data: user, message: "Lấy người dùng thành công." });
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
          .json({ message: "Người dùng không tồn tại !" });
      }
      return res.status(StatusCodes.OK).json({ message: "Xóa thành công !" });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id);
      if (!user) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Người dùng không tồn tại !" });
      }
      let { name, email, avatar, password, newPassword, confirmPassword } =
        req.body;

      if (newPassword && newPassword !== confirmPassword) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Mật khẩu mới không khớp !" });
      }

      if (password) {
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Mật khẩu không đúng !" });
        }
        if (newPassword) {
          const hashedPassword = await bcryptjs.hash(newPassword, 10);
          user.password = hashedPassword;
        }
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.avatar = avatar || user.avatar;
      await user.save();

      return res
        .status(StatusCodes.OK)
        .json({ message: "Cập nhật người dùng thành công !" });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
  sendOtp: async (req, res) => {
    try {
      let email;

      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Không có token" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        email = decoded.email;
      } else {
        email = req.body.email;
      }

      if (!email) {
        return res.status(400).json({ message: "Vui lòng cung cấp email" });
      }

      const user = await User.findOne({ email });

      if (!user)
        return res.status(404).json({ message: "Không tìm thấy người dùng" });

      const otp = crypto.randomInt(100000, 999999).toString();
      user.otp = otp;
      user.otpExpire = Date.now() + 60 * 1000;

      await user.save();

      sendOtpEmail(otp, email);

      if (!req.headers.authorization) {
        const token = createToken(user);
        return res
          .status(StatusCodes.OK)
          .json({ message: "Đã gửi mã OTP đến email của bạn", token });
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: "Đã gửi mã OTP đến email của bạn" });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  verifyOtp: async (req, res) => {
    const { otp } = req.body;
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Không có token" });

      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      const email = decoded.email;

      const user = await User.findOne({ email });

      if (!user)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy người dùng" });

      if (user.otp !== otp)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "OTP không đúng" });

      if (user.otpExpire < Date.now())
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "OTP hết hạn" });

      user.otp = undefined;
      user.otpExpire = undefined;
      await user.save();

      return res
        .status(StatusCodes.OK)
        .json({ message: "Xác thực thành công" });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
  newPassword: async (req, res) => {
    try {
      const { newPassword, confirmPassword } = req.body;

      const token = req.headers.authorization.split(" ")[1];
      if (!token)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Không có token" });

      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      const email = decoded.email;

      const user = await User.findOne({ email });

      if (!user)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy người dùng" });

      if (newPassword !== confirmPassword)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Mật khẩu không khớp" });

      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();

      return res
        .status(StatusCodes.OK)
        .json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
};

export default UserController;

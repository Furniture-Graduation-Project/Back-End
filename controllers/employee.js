import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Employee from '../models/employee.js';
import {
  employeeSchema,
  signinEmployeeSchema,
  updateEmployeePassword,
} from '../validations/employee.js';
import {
  clearCookies,
  generateRefreshToken,
  generateTokenAndSetCookie,
} from '../utils/token.js';

const EmployeeController = {
  searchByFullName: async (req, res) => {
    try {
      const { fullName } = req.query;

      if (!fullName) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Vui lòng cung cấp fullName để tìm kiếm.',
        });
      }

      const employees = await Employee.find({
        fullName: { $regex: fullName, $options: 'i' },
      });

      if (!employees || employees.length === 0) {
        return res.status(StatusCodes.OK).json({
          message: 'Không tìm thấy nhân viên nào với fullName này.',
        });
      }

      return res.status(StatusCodes.OK).json({
        message: 'Tìm kiếm thành công.',
        data: employees,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra khi tìm kiếm nhân viên.',
        error: error.message,
      });
    }
  },

  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const employees = await Employee.find({ role: { $ne: 'admin' } })
        .skip(skip) 
        .limit(limit)
        .select('-password');
      if (!employees || employees.length === 0) {
        return res.status(StatusCodes.OK).json({
          message: 'Không có nhân viên tồn tại.',
        });
      }

      const totalData = await Employee.countDocuments();
      const totalPage = limit ? Math.ceil(totalData / limit) : 1;

      return res.status(StatusCodes.OK).json({
        data: employees,
        totalPage,
        totalData,
        message: 'Lấy danh sách nhân viên thành công.',
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra khi lấy thông tin nhân viên.',
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const employees = await Employee.find();
      return res.status(StatusCodes.OK).json({
        message: 'Lấy tất cả nhân viên thành công',
        data: employees,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  getDetail: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Không tìm thấy nhân viên',
      });
    }
    try {
      const employee = await Employee.findById(id).select('-password');
      if (!employee) {
        return res.status(StatusCodes.OK).json({
          message: 'Nhân viên không tìm thấy',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Lấy chi tiết nhân viên thành công',
        data: employee,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { value, error } = employeeSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }

      const existingEmployee = await Employee.findOne({
        employeename: value.employeename,
      });
      if (existingEmployee) {
        return res.status(StatusCodes.CONFLICT).json({
          message:
            'Tên đăng nhập đã tồn tại, vui lòng chọn tên đăng nhập khác.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(value.password, salt);

      const employee = await Employee.create({
        ...value,
        password: hashedPassword,
      });

      return res.status(StatusCodes.CREATED).json({
        message: 'Tạo nhân viên thành công',
        data: employee,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },
  refreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    try {
      if (!refreshToken)
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Không có refresh token' });
      const employee = await Employee.findOne({ refreshToken });
      if (!employee)
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Không tìm thấy nhân viên với token này' });
      jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err) => {
        if (err)
          return res.status(
            StatusCodes.FORBIDDEN,
            json({ message: 'Không thể truy cập token này' }),
          );
        const newAccessToken = generateTokenAndSetCookie(
          String(employee._id),
          res,
        );
        return res.status(StatusCodes.OK).json({
          token: newAccessToken,
          message: 'Làm mới token thành công !',
        });
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  },
  signin: async (req, res) => {
    try {
      const { value, error } = signinEmployeeSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const message = error.details.map((e) => e.message);
        return res.status(StatusCodes.BAD_REQUEST).json({ message });
      }

      const employee = await Employee.findOne({
        username: value.username,
      });
      if (!employee) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Tên đăng nhập không tồn tại!',
        });
      }

      const isMatch = await bcrypt.compare(value.password, employee.password);
      if (!isMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Sai mật khẩu!',
        });
      }

      const token = generateTokenAndSetCookie(employee._id, res);
      const refreshToken = generateRefreshToken(employee._id, res);
      employee.refreshToken = refreshToken;
      employee.save();
      return res.status(StatusCodes.OK).json({
        message: 'Đăng nhập thành công',
        data: employee,
        token,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Không tìm thấy nhân viên',
      });
    }
    try {
      const { value, error } = employeeSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }

      const employee = await Employee.findByIdAndUpdate(id, value, {
        new: true,
      });

      if (!employee) {
        return res.status(StatusCodes.OK).json({
          message: 'Nhân viên không tìm thấy',
        });
      }

      return res.status(StatusCodes.OK).json({
        message: 'Cập nhật nhân viên thành công',
        data: employee,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  updatePassword: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Không tìm thấy nhân viên',
      });
    }
    try {
      const { value, error } = updateEmployeePassword.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }

      const employee = await Employee.findById(id);
      if (!employee) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Nhân viên không tìm thấy',
        });
      }

      const isMatch = await bcrypt.compare(
        value.oldPassword,
        employee.password,
      );
      if (!isMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Mật khẩu cũ không đúng',
        });
      }

      const hashedPassword = await bcrypt.hash(value.newPassword, 10);
      employee.password = hashedPassword;
      await employee.save();

      return res.status(StatusCodes.OK).json({
        message: 'Cập nhật mật khẩu thành công',
        data: employee,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Không tìm thấy nhân viên',
      });
    }
    try {
      const employee = await Employee.findByIdAndDelete(id);
      if (!employee) {
        return res.status(StatusCodes.OK).json({
          message: 'Nhân viên không tìm thấy',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Xóa nhân viên thành công',
        data: employee,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },
  logout: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Token làm mới không hợp lệ' });
      }
      const employee = await Employee.findOne({ refreshToken });
      if (!employee) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Không tìm thấy nhân viên' });
      }
      employee.refreshToken = null;
      await employee.save();
      clearCookies(res);
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Đăng xuất thành công' });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  },
};

export default EmployeeController;

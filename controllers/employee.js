import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import Employee from "../models/employee.js";
import { employeeSchema } from "../validations/employee.js";
import { generateTokenAndSetCookie } from "../utils/token.js";
import dotenv from "dotenv";
dotenv.config();

const EmployeeController = {
  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const employees = await Employee.find().skip(skip).limit(limit);
      if (!employees || employees.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không có nhân viên tồn tại." });
      }

      const totalData = await Employee.countDocuments();
      const totalPage = limit ? Math.ceil(totalData / limit) : 1;

      res.status(StatusCodes.OK).json({
        data: employees,
        totalPage,
        totalData,
        message: "Lấy danh sách nhân viên thành công.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi lấy thông tin nhân viên.",
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const employees = await Employee.find();
      return res.status(StatusCodes.OK).json({
        message: "Lấy tất cả nhân viên thành công",
        data: employees,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  getDetail: async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy nhân viên" });
    }
    try {
      const employee = await Employee.findById(id);
      if (!employee) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Nhân viên không tìm thấy",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Lấy chi tiết nhân viên thành công",
        data: employee,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Lỗi: " + error.message,
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
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(value.password, salt);
      const employee = await Employee.create({
        ...value,
        password: hashedPassword,
      });

      return res.status(StatusCodes.CREATED).json({
        message: "Tạo nhân viên thành công",
        data: employee,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  signin: async (req, res) => {
    try {
      const { value, error } = signinSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const message = error.details.map((e) => e.message);
        return res.status(StatusCodes.BAD_REQUEST).json({ message });
      }

      const employee = await Employee.findOne({ username: value.username });
      if (!employee) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Tên đăng nhập không tồn tại!",
        });
      }

      const isMatch = await bcrypt.compare(value.password, employee.password);
      if (!isMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Sai mật khẩu!",
        });
      }

      const token = generateTokenAndSetCookie(employee._id, res);

      return res.status(StatusCodes.OK).json({
        message: "Đăng nhập thành công",
        data: employee,
        token,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy nhân viên" });
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
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Nhân viên không tìm thấy",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Cập nhật nhân viên thành công",
        data: employee,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  delete: async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy nhân viên" });
    }
    try {
      const employee = await Employee.findByIdAndDelete(id);
      if (!employee) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Nhân viên không tìm thấy",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Xóa nhân viên thành công",
        data: employee,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },
};

export default EmployeeController;

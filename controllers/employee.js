import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import Employee from '../models/employee.js';
import { employeeSchema } from '../validations/employee.js';

const EmployeeController = {
  getAll: async (req, res) => {
    try {
      const employees = await Employee.find();
      return res.status(StatusCodes.OK).json({
        message: 'Lấy tất cả nhân viên thành công',
        data: employees,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  getDetail: async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Nhân viên không tìm thấy',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Lấy chi tiết nhân viên thành công',
        data: employee,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { error } = employeeSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }
      const { password, ...otherDetails } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const employee = await Employee.create({
        ...otherDetails,
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

  update: async (req, res) => {
    try {
      const { error } = employeeSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
      );
      if (!employee) {
        return res.status(StatusCodes.NOT_FOUND).json({
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

  delete: async (req, res) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id);
      if (!employee) {
        return res.status(StatusCodes.NOT_FOUND).json({
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
};

export default EmployeeController;

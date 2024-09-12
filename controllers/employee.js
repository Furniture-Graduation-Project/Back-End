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
    const id = req.params.id;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy nhân viên' });
    }
    try {
      const employee = await Employee.findById(id);
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
      const hashedPassword = await bcrypt.hash(password, salt);
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

  update: async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy nhân viên' });
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
    const id = req.params.id;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy nhân viên' });
    }
    try {
      const employee = await Employee.findByIdAndDelete(id);
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

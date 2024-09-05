import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import Employee from "../models/employee.js";
import { employeeSchema } from "../validations/employee.js";

export const getAllEmployee = async (req, res) => {
  try {
    const employees = await Employee.find();
    return res.status(StatusCodes.OK).json({
      message: "Get All Employee Done",
      data: employees,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const getDetailEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Employee not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Get Detail Employee Done",
      data: employee,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { error } = employeeSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const { password, ...otherDetails } = req.body;

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo mới nhân viên với mật khẩu đã mã hóa
    const employee = await Employee.create({
      ...otherDetails,
      password: hashedPassword,
    });
    return res.status(StatusCodes.CREATED).json({
      message: "Create Employee Done",
      data: employee,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const editEmployee = async (req, res) => {
  try {
    const { error } = employeeSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!employee) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Employee not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Update Employee Done",
      data: employee,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Employee not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Delete Employee Done",
      data: employee,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

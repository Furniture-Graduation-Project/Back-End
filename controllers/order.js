import { StatusCodes } from "http-status-codes";
import OrderModel from "../models/order.js";
import { createOrderSchema, updateOrderSchema } from "../validations/order.js";

const OrderController = {
  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const orders = await OrderModel.find()
        .skip(skip)
        .limit(limit)
        .populate({
          path: "items",
          populate: { path: "productId" },
        });

      if (!orders || orders.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không có đơn hàng nào tồn tại.",
        });
      }

      const totalData = await OrderModel.countDocuments();
      const totalPage = Math.ceil(totalData / limit);

      res.status(StatusCodes.OK).json({
        data: orders,
        totalPage,
        totalData,
        message: "Lấy danh sách đơn hàng thành công.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi lấy danh sách đơn hàng.",
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const orders = await OrderModel.find().populate({
        path: "items",
        populate: { path: "productId" },
      });
      res.status(StatusCodes.OK).json({
        message: "Lấy danh sách đơn hàng thành công",
        data: orders,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  getByIdOrder: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không tìm thấy đơn hàng",
      });
    }
    try {
      const order = await OrderModel.findById(id).populate({
        path: "items",
        populate: { path: "productId" },
      });
      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Đơn hàng không tồn tại",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Lấy đơn hàng thành công",
        data: order,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  getByIdUser: async (req, res) => {
    const { id } = req.params;
    try {
      const orders = await OrderModel.find({ userId: id }).populate({
        path: "items",
        populate: { path: "productId" },
      });

      if (!orders || orders.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Người dùng chưa có đơn hàng nào",
        });
      }

      return res.status(StatusCodes.OK).json({
        message: "Lấy đơn hàng của người dùng thành công",
        data: orders,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { value, error } = createOrderSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }
      const order = await OrderModel.create(value);
      return res.status(StatusCodes.CREATED).json({
        message: "Tạo đơn hàng thành công",
        data: order,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không tìm thấy đơn hàng",
      });
    }
    try {
      const { value, error } = updateOrderSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }
      const updatedOrder = await OrderModel.findByIdAndUpdate(id, value, {
        new: true,
      });
      if (!updatedOrder) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Đơn hàng không tồn tại",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Cập nhật đơn hàng thành công",
        data: updatedOrder,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không tìm thấy đơn hàng",
      });
    }
    try {
      const order = await OrderModel.findByIdAndDelete(id);
      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Đơn hàng không tồn tại",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Xóa đơn hàng thành công",
        data: order,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
};

export default OrderController;

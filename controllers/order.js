import { StatusCodes } from "http-status-codes";
import OrderModel from "../models/order.js";
import { createOrderSchema, updateOrderSchema } from "../validations/order.js";

const OrderController = {
  getAll: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const result = await OrderController.getLimited(page, limit);
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  getLimited: async (page = 1, limit = 10) => {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    try {
      const orders = await OrderModel.find()
        .skip(skip)
        .limit(limitNumber)
        .populate({
          path: "items",
          populate: {
            path: "productId",
          },
        });

      const total = await OrderModel.countDocuments();
      return {
        data: orders,
        page: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalItems: total,
        message: "Lấy danh sách đơn hàng thành công",
      };
    } catch (error) {
      throw new Error("Lấy danh sách đơn hàng thất bại: " + error.message);
    }
  },

  getByIdOrder: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy đơn hàng" });
    }
    try {
      const order = await OrderModel.findById(id).populate({
        path: "items",
        populate: { path: "productId" },
      });

      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Đơn hàng không tồn tại!",
        });
      }

      return res.status(StatusCodes.OK).json({
        data: order,
        message: "Lấy đơn hàng thành công!",
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  getByIdUser: async (req, res) => {
    const { id } = req.params;
    try {
      const orders = await OrderModel.find({ userId: id }).populate({
        path: "items",
        populate: { path: "productId" },
      });

      if (orders.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Người dùng chưa có đơn hàng nào!",
        });
      }

      return res.status(StatusCodes.OK).json({
        data: orders,
        message: "Lấy đơn hàng của người dùng thành công!",
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  add: async (req, res) => {
    const {
      userId,
      orderName,
      orderPhone,
      orderAddress,
      totalPrice,
      items,
      payment,
    } = req.body;
    try {
      const { error, value } = createOrderSchema.validate(
        {
          userId,
          orderName,
          orderPhone,
          orderAddress,
          totalPrice,
          items,
          payment,
        },
        { abortEarly: false, stripUnknown: true }
      );
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: error.details.map((detail) => detail.message),
        });
      }
      const data = await OrderModel.create(value);
      return res.status(StatusCodes.CREATED).json({
        data,
        message: "Đơn hàng đã đặt thành công!",
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy đơn hàng" });
    }

    const {
      userId,
      orderName,
      orderPhone,
      orderAddress,
      totalPrice,
      items,
      payment,
      shipment,
      status,
      deliveryPerson,
    } = req.body;

    try {
      const updateData = {
        ...(userId && { userId }),
        ...(orderName && { orderName }),
        ...(orderPhone && { orderPhone }),
        ...(orderAddress && { orderAddress }),
        ...(totalPrice && { totalPrice }),
        ...(items && { items }),
        ...(payment && { payment }),
        ...(shipment && { shipment }),
        ...(status && { status }),
        ...(deliveryPerson && { deliveryPerson }),
      };
      const { error, value } = updateOrderSchema.validate(updateData, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: error.details.map((detail) => detail.message),
        });
      }
      const updatedOrder = await OrderModel.findByIdAndUpdate(id, value, {
        new: true,
      });
      if (!updatedOrder) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Đơn hàng không tồn tại!",
        });
      }

      return res.status(StatusCodes.OK).json({
        data: updatedOrder,
        message: "Cập nhật đơn hàng thành công!",
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không tìm thấy đơn hàng",
      });
    }
    try {
      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Đơn hàng không tồn tại!",
        });
      }
      const data = await OrderModel.findByIdAndDelete(id);
      return res.status(StatusCodes.OK).json({
        data,
        message: "Xóa đơn hàng thành công!",
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
};

export default OrderController;

import { StatusCodes } from "http-status-codes";
import OrderModel from "../models/order.js";
import orderValidation from "../validations/order.js";

const OrderController = {
  getAll: async (req, res) => {
    try {
      const Order = await OrderModel.find().populate({
        path: "items",
        populate: {
          path: "productId",
        },
      });
      return res.status(StatusCodes.OK).json({
        data: Order,
        message: "Lấy danh sách đơn hàng thành công",
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
  getByIdOrder: async (req, res) => {
    const { id } = req.params;
    try {
      console.log(id);
      const order = await OrderModel.findById(id).populate({
        path: "items",
        populate: {
          path: "productId",
        },
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
        populate: {
          path: "productId",
        },
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
      shipments,
      status,
      deliveryPerson,
    } = req.body;

    try {
      const { error, value } = orderValidation.requiredSchema.validate(
        {
          userId,
          orderName,
          orderPhone,
          orderAddress,
          totalPrice,
          items,
          payment,
          shipments,
          status,
          deliveryPerson,
        },
        { abortEarly: false }
      );
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: error.details.map((detail) => detail.message),
        });
      }

      const data = await OrderModel.create(value);
      return res.status(StatusCodes.CREATED).json(data);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const {
      userId,
      orderName,
      orderPhone,
      orderAddress,
      totalPrice,
      items,
      payment,
      shipments,
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
        ...(shipments && { shipments }),
        ...(status && { status }),
        ...(deliveryPerson && { deliveryPerson }),
      };
      const { error, value } = orderValidation.optionalSchema.validate(
        updateData,
        {
          abortEarly: false,
        }
      );
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
    try {
      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Đơn hàng không tồn tại!",
        });
      }
      const data = await OrderModel.findByIdAndDelete(id);
      return res.status(StatusCodes.OK).json(data);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
};

export default OrderController;

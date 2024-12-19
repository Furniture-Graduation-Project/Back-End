import { StatusCodes } from "http-status-codes";
import OrderModel from "../models/order.js";
import { createOrderSchema, updateOrderSchema } from "../validations/order.js";
import { io } from "../services/socket.js";
import ProductItemModel from "../models/productItem.js";
import { ProductController } from "./product.js";
import CartModel from "../models/cart.js";
import generateQrCode from "../services/qrcode.js";
import { checkPaidSchema } from "../validations/payment.js";
import paymentApiCall from "../services/payment.js";
import generateOrderCode from "../utils/orderCode.js";
import {
  sendDeliveredNotificationEmail,
  sendShipmentNotificationEmail,
} from "../services/emailOrder.js";
import mongoose from "mongoose";

const OrderController = {
  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      let query = {};
      if (req.query.code) query.code = req.query.code;
      if (req.query.status) query.status = req.query.status;
      if (req.query.payment) query["payment.paymentStatus"] = req.query.payment;
      if (req.query.return) {
        query["returnInfo.status"] = req.query.return;
      }
      if (req.query.filter && req.query.filter != "all") {
        if (req.query.filter == "normal") {
          query["returnInfo.items.length"] = { $eq: 0 };
        } else {
          query["returnInfo.items"] = { $exists: true, $not: { $size: 0 } };
        }
      }
      const orders = await OrderModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "items",
          populate: { path: "productId" },
        });
      const totalData = await OrderModel.countDocuments(query);

      if (!orders || orders.length === 0) {
        return res.status(StatusCodes.OK).json({
          message: "Không có đơn hàng nào tồn tại.",
        });
      }

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
      const order = await OrderModel.findById(id)
        .populate({
          path: "items",
          populate: { path: "productId" },
        })
        .populate({
          path: "items",
          populate: { path: "productOptionId" },
        })
        .populate({
          path: "returnInfo",
          populate: { path: "items", populate: { path: "productId" } },
        })
        .populate({
          path: "returnInfo",
          populate: { path: "items", populate: { path: "productOptionId" } },
        });
      if (!order) {
        return res.status(StatusCodes.OK).json({
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
    try {
      const user = req.user;
      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Không tìm thấy người dùng",
        });
      }
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      let query = {};
      if (req.query.code) query.code = req.query.code;
      if (
        req.query.status &&
        req.query.status != "return" &&
        req.query.status != "all"
      )
        query.status = req.query.status;
      if (req.query.status && req.query.status == "return") {
        if (req.query.filter == "normal") {
          query["returnInfo.items.length"] = { $eq: 0 };
        } else {
          query["returnInfo.items"] = { $exists: true, $not: { $size: 0 } };
        }
      }
      query.userId = String(user._id);
      query.deleted = false;
      const orders = await OrderModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "items",
          populate: { path: "productId" },
        });
      const totalData = await OrderModel.countDocuments(query);
      if (!orders || orders.length === 0) {
        return res.status(StatusCodes.OK).json({
          message: "Người dùng chưa có đơn hàng nào",
        });
      }

      return res.status(StatusCodes.OK).json({
        message: "Lấy đơn hàng của người dùng thành công",
        data: orders,
        totalPage: Math.ceil(totalData / limit),
        totalData: totalData,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  create: async (req, res) => {
    const session = await mongoose.startSession();
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
      const items = await ProductController.checkProduct(value.items);
      const isChanged = items.some((item, index) => {
        const originalItem = value.items[index];
        return (
          item.productId.toString() !== originalItem.productId ||
          item.productOptionId.toString() !== originalItem.productOptionId ||
          item.quantity < originalItem.quantity ||
          item.unitPrice !== originalItem.unitPrice
        );
      });

      if (isChanged) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          data: items,
          message: "Sản phẩm trong đơn hàng đã có sự thay đổi.",
        });
      }
      await session.withTransaction(async () => {
        const code = generateOrderCode();
        await Promise.all(
          value.items.map(async (item) => {
            const result = await ProductItemModel.findOneAndUpdate(
              {
                _id: item.productOptionId,
                stock: { $gte: item.quantity },
              },
              {
                $inc: { outStock: item.quantity },
              },
              { new: true, session }
            );

            if (!result) {
              throw new Error(
                `Sản phẩm ${item.productOptionId} không đủ số lượng.`
              );
            }
          })
        );
        const order = await OrderModel.create([{ ...value, code }], {
          session,
        });
        await Promise.all(
          value.items.map(async (item) => {
            await CartModel.findOneAndUpdate(
              {
                UserID: value.userId,
                "carts.productId": item.productId,
                "carts.productOptionId": item.productOptionId,
              },
              {
                $pull: {
                  carts: {
                    productId: item.productId,
                    productOptionId: item.productOptionId,
                  },
                },
              },
              { session }
            );
          })
        );
        io.emit("Order", order);
        res.status(StatusCodes.CREATED).json({
          message: "Tạo đơn hàng thành công.",
          data: order[0],
        });
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    } finally {
      session.endSession();
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
      const updatedOrder = await OrderModel.findById(id)
        .populate({
          path: "userId",
        })
        .populate({
          path: "items",
          populate: { path: "productId" },
        })
        .populate({
          path: "items",
          populate: { path: "productOptionId" },
        });
      if (
        value.status === "cancelled" &&
        !["pending", "unpaid", "confirmed"].includes(updatedOrder.status)
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Trạng thái đơn hàng không hợp lệ",
        });
      }
      if (
        value.payment?.paymentStatus &&
        value.payment.paymentStatus === "unpaid" &&
        updatedOrder.payment.paymentStatus == "paid"
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Trạng thái thanh toán đơn hàng không thể thay đổi",
        });
      }
      if (
        value.payment?.paymentStatus &&
        value.payment?.paymentStatus === "paid" &&
        updatedOrder.status != "delivered" &&
        updatedOrder.payment.paymentMethod == "cash_on_delivery"
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message:
            "Trạng thái thanh toán đơn hàng này không thể thay đổi khi chưa giao hàng",
        });
      }
      updatedOrder.set(value);
      await updatedOrder.save();
      if (!updatedOrder) {
        return res.status(StatusCodes.OK).json({
          message: "Đơn hàng không tồn tại",
        });
      }
      if (updatedOrder.status === "cancelled") {
        await Promise.all(
          updatedOrder.items.map(async (item) => {
            const productItem = await ProductItemModel.findById(
              item.productOptionId
            );
            productItem.outStock -= item.quantity;
            await productItem.save();
          })
        );
      }
      if (
        updatedOrder.status === "delivered" &&
        updatedOrder.payment.paymentStatus === "paid" &&
        updatedOrder.payment.paymentMethod !== "credit_card"
      ) {
        io.emit(String(updatedOrder.userId._id), updatedOrder);
        sendShipmentNotificationEmail(updatedOrder);
      }
      if (
        updatedOrder.status === "delivered" &&
        updatedOrder.payment.paymentStatus === "unpaid" &&
        updatedOrder.payment.paymentMethod !== "cash_on_delivery"
      ) {
        io.emit(String(updatedOrder.userId._id), updatedOrder);
        sendShipmentNotificationEmail(updatedOrder);
      }
      if (
        updatedOrder.status === "received" &&
        !updatedOrder.statusHistory.some(
          (item) =>
            item.status === "received" &&
            updatedOrder.returnInfo?.items?.length == 0
        )
      ) {
        sendDeliveredNotificationEmail(updatedOrder);
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
  finishRequest: async (req, res) => {
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
      const updatedOrder = await OrderModel.findByIdAndUpdate(id, value);
      if (!updatedOrder) {
        return res.status(StatusCodes.OK).json({
          message: "Đơn hàng không tồn tại",
        });
      }
      if (updatedOrder.returnInfo?.items?.length > 0) {
        await Promise.all(
          updatedOrder.returnInfo.items.map(async (item) => {
            const productItem = await ProductItemModel.findById(
              item.productOptionId
            );
            if (!productItem) {
              throw new Error(
                `Không tìm thấy sản phẩm với ID: ${item.productOptionId}`
              );
            }
            productItem.outStock -= item.quantity;
            await productItem.save();
          })
        );
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
        return res.status(StatusCodes.OK).json({
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

  createQrCode: async (req, res) => {
    try {
      const { amount, addInfo } = req.body;
      if (!amount || !addInfo) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Không tìm thấy dữ liệu đầu vào",
        });
      }
      const qrCode = await generateQrCode({ amount, addInfo });
      if (!qrCode) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Tạo QRCode thất bại",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Tạo QRCode thành công",
        data: qrCode,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
  payment: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không tìm thấy đơn hàng",
      });
    }
    try {
      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(StatusCodes.OK).json({
          message: "Đơn hàng không tồn tại",
        });
      }
      const { value, error } = checkPaidSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      const date = new Date();
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }
      const checkPayment = await paymentApiCall({
        ...value,
        startTime: date,
      });

      if (!checkPayment) {
        return res.status().json({
          message: "Thanh toán thất bại, vui lòng thực hiện lại!",
        });
      }
      order.payment.paymentStatus = "paid";
      order.status = "pending";
      await order.save();
      return res.status(StatusCodes.OK).json({
        message: "Thanh toán thành công!",
        data: order,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  checkProductOrder: async (req, res) => {
    try {
      const productDetails = await ProductController.checkProduct(req.body);
      return res.status(StatusCodes.OK).json({
        message: "Kiểm tra sản phẩm thành công",
        data: productDetails,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
  countOrder: async (req, res) => {
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

      const countToday = await OrderModel.countDocuments(filterToday);
      const countPrevious = await OrderModel.countDocuments(filterPrevious);
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
  revenueOrder: async (req, res) => {
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

      const revenueToday = await OrderModel.aggregate([
        {
          $match: {
            ...filterToday,
            "payment.paymentStatus": "paid",
            status: "received",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
      ]);

      const revenuePrevious = await OrderModel.aggregate([
        {
          $match: {
            ...filterPrevious,
            "payment.paymentStatus": "paid",
            status: "delivered",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
      ]);

      const currentRevenue = revenueToday[0]?.totalRevenue || 0;
      const previousRevenue = revenuePrevious[0]?.totalRevenue || 0;

      return res.status(StatusCodes.OK).json({
        current: currentRevenue,
        previous: previousRevenue,
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
};

export default OrderController;

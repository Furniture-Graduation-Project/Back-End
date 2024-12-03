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

const OrderController = {
  getLimited: async (req, res) => {
    try {
      const user = req.user;
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      let totalData;
      let orders;
      if (user) {
        orders = await OrderModel.find({ userId: user._id, deleted: false })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate({
            path: "items",
            populate: { path: "productId" },
          });
        totalData = await OrderModel.countDocuments({ deleted: false });
      } else {
        orders = await OrderModel.find()
          .skip(skip)
          .limit(limit)
          .populate({
            path: "items",
            populate: { path: "productId" },
          });
        totalData = await OrderModel.countDocuments();
      }

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
    const { id } = req.params;
    try {
      const orders = await OrderModel.find({ userId: id }).populate({
        path: "items",
        populate: { path: "productId" },
      });

      if (!orders || orders.length === 0) {
        return res.status(StatusCodes.OK).json({
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
      await Promise.all(
        value.items.map(async (item) => {
          const productItem = await ProductItemModel.findById(
            item.productOptionId
          );
          productItem.outStock += item.quantity;
          await productItem.save();
        })
      );
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
            }
          );
        })
      );
      const order = await OrderModel.create(value);
      io.emit("Order", order);
      return res.status(StatusCodes.CREATED).json({
        message: "Tạo đơn hàng thành công.",
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
        return res.status(StatusCodes.OK).json({
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
      console.log(date);

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

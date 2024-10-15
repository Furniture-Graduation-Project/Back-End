import CartModel from "../models/cart.js";
import { StatusCodes } from "http-status-codes";
import { createCartSchema, updateCartSchema } from "../validations/cart.js";

const CartController = {
  create: async (req, res) => {
    const { value, error } = createCartSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }
    try {
      const cart = new CartModel({
        ...value,
      });

      await cart.save();
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Tạo giỏ hàng thành công", cart });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Tạo giỏ hàng thất bại", error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await CartController.find({});

      res.status(StatusCodes.OK).json({
        data: result,
        message: "Danh sách giỏ hàng đã được lấy.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lấy danh sách giỏ hàng thất bại",
        error: error.message,
      });
    }
  },

  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const carts = await CartModel.find()
        .skip(skip)
        .limit(limit)
        .populate("cartItems");

      if (!carts || carts.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không có giỏ hàng nào." });
      }

      const totalData = await CartModel.countDocuments();
      const totalPage = limit ? Math.ceil(totalData / limit) : 1;

      res.status(StatusCodes.OK).json({
        data: carts,
        totalPage,
        totalData,
        message: "Lấy danh sách giỏ hàng thành công.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi lấy thông tin giỏ hàng.",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy giỏ hàng" });
    }
    try {
      const cart = await CartModel.findById(id).populate("cartItems");
      if (!cart) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy giỏ hàng" });
      }
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Lấy giỏ hàng thất bại", error: error.message });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy giỏ hàng" });
    }

    const { value, error } = updateCartSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }

    try {
      const cart = await CartModel.findByIdAndUpdate(id, value, {
        new: true,
      });

      if (!cart) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy giỏ hàng" });
      }

      res
        .status(StatusCodes.OK)
        .json({ message: "Cập nhật giỏ hàng thành công", cart });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Cập nhật giỏ hàng thất bại", error: error.message });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy giỏ hàng" });
    }
    try {
      const cart = await CartModel.findByIdAndDelete(id);
      if (!cart) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy giỏ hàng" });
      }

      res.status(StatusCodes.OK).json({ message: "Xóa giỏ hàng thành công" });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Xóa giỏ hàng thất bại", error: error.message });
    }
  },
};

export default CartController;

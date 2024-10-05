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
      const { page, limit } = req.query; // Lấy giá trị từ query
      const result = await CartController.getLimited(page, limit);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lấy danh sách giỏ hàng thất bại",
        error: error.message,
      });
    }
  },

  getLimited: async (page, limit) => {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    try {
      const carts = await CartModel.find()
        .skip(skip)
        .limit(limitNumber)
        .populate("cartItems");
      const total = await CartModel.countDocuments();
      return {
        data: carts,
        page: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalItems: total,
        message: "Lấy danh sách giỏ hàng thành công",
      };
    } catch (error) {
      throw new Error("Lấy danh sách giỏ hàng thất bại: " + error.message);
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

import CartModel from "../models/cart.js";
import { createValidate, updateValidate } from "../validations/cart.js";

const CartController = {
  async getAllCarts(req, res) {
    try {
      const carts = await CartModel.find();
      res.status(StatusCodes.OK).json({
        message: "Hiển thị thành công",
        data: carts,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async detailCart(req, res) {
    try {
      const cart = await CartModel.findById(req.params.id);
      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy giỏ hàng",
        });
      }
      res.status(StatusCodes.OK).json({
        message: "Hiển thị thành công",
        data: cart,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async createCart(req, res) {
    try {
      const { error } = createValidate.validate(req.body);
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }

      const cartData = req.body;
      cartData.Price = cartData.Quantity * cartData.Price;

      const cart = await CartModel.create(cartData);
      res.status(StatusCodes.CREATED).json({
        message: "Thêm giỏ hàng thành công",
        data: cart,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async updateCart(req, res) {
    try {
      const { error } = updateValidate.validate(req.body);
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }

      const cartData = req.body;
      if (cartData.Quantity && cartData.Price) {
        cartData.Price = cartData.Quantity * cartData.Price;
      }

      const cart = await CartModel.findByIdAndUpdate(req.params.id, cartData, {
        new: true,
      });
      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy giỏ hàng",
        });
      }
      res.status(StatusCodes.OK).json({
        message: "Cập nhật giỏ hàng thành công",
        data: cart,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async deleteCart(req, res) {
    try {
      const cart = await CartModel.findByIdAndDelete(req.params.id);
      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy giỏ hàng",
        });
      }
      res.status(StatusCodes.OK).json({
        message: "Xóa giỏ hàng thành công",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
};

export default CartController;

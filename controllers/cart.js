import { StatusCodes } from 'http-status-codes';
import CartModel from '../models/cart.js';
import { createCartSchema, updateCartSchema } from '../validations/cart.js';

const CartController = {
  async getAll(req, res) {
    try {
      const carts = await CartModel.find();
      res.status(StatusCodes.OK).json({
        message: 'Hiển thị thành công',
        data: carts,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async detail(req, res) {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy giỏ hàng' });
    }
    try {
      const cart = await CartModel.findById(id);
      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Không tìm thấy giỏ hàng',
        });
      }
      res.status(StatusCodes.OK).json({
        message: 'Hiển thị thành công',
        data: cart,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async create(req, res) {
    try {
      const { value, error } = createCartSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }
      value.price = value.quantity * value.price;

      const cart = await CartModel.create(value);
      res.status(StatusCodes.CREATED).json({
        message: 'Thêm giỏ hàng thành công',
        data: cart,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async update(req, res) {
    const id = req.params.id;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy giỏ hàng' });
    }
    try {
      const { value, error } = updateCartSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }
      if (value.quantity && value.price) {
        value.price = value.quantity * value.price;
      }

      const cart = await CartModel.findByIdAndUpdate(id, value, {
        new: true,
      });
      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Không tìm thấy giỏ hàng',
        });
      }
      res.status(StatusCodes.OK).json({
        message: 'Cập nhật giỏ hàng thành công',
        data: cart,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async delete(req, res) {
    const id = req.params.id;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Không tìm thấy giỏ hàng',
      });
    }
    try {
      const cart = await CartModel.findByIdAndDelete(id);
      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Không tìm thấy giỏ hàng',
        });
      }
      res.status(StatusCodes.OK).json({
        message: 'Xóa giỏ hàng thành công',
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
};

export default CartController;

import CartModel from '../models/cart.js';
import { StatusCodes } from 'http-status-codes';
import { createCartSchema, updateCartSchema } from '../validations/cart.js';
import mongoose from 'mongoose';

const CartController = {
  create: async (req, res) => {
    console.log(req.body);
    
    const { value, error } = createCartSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    console.log(value);
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
        .json({ message: 'Tạo giỏ hàng thành công', cart });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Tạo giỏ hàng thất bại', error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await CartModel.find();
      res.status(StatusCodes.OK).json({
        data: result,
        message: 'Danh sách giỏ hàng đã được lấy.',
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lấy danh sách giỏ hàng thất bại',
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
        .populate('cartItems');

      if (!carts || carts.length === 0) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không có giỏ hàng nào.' });
      }

      const totalData = await CartModel.countDocuments();
      const totalPage = limit ? Math.ceil(totalData / limit) : 1;

      res.status(StatusCodes.OK).json({
        data: carts,
        totalPage,
        totalData,
        message: 'Lấy danh sách giỏ hàng thành công.',
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra khi lấy thông tin giỏ hàng.',
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy giỏ hàng' });
    }
    try {
      const cart = await CartModel.findOne({ UserID: id })
        .populate({
          path: 'carts.productID',
          model: 'Product',
        })
        .populate({
          path: 'carts.productItemID',
          model: 'ProductItem',
        });

      if (!cart) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không tìm thấy giỏ hàng' });
      }
      res.status(StatusCodes.OK).json({
        data: cart,
        message: 'Lấy thông tin giỏ hàng thành công.',
      });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Lấy giỏ hàng thất bại', error: error.message });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy giỏ hàng' });
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
          .status(StatusCodes.OK)
          .json({ message: 'Không tìm thấy giỏ hàng' });
      }

      res
        .status(StatusCodes.OK)
        .json({ message: 'Cập nhật giỏ hàng thành công', cart });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Cập nhật giỏ hàng thất bại', error: error.message });
    }
  },

  delete: async (req, res) => {
    const { productID, productItemID } = req.params;

    if (!productID || !productItemID) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy giỏ hàng hợp lệ' });
    }

    try {
      const userId = req.user._id;
      g;
      const cart = await CartModel.findOne(
        {
          UserID: userId,
          'carts.productID._id': new mongoose.Types.ObjectId(productID),
          'carts.productItemID._id': new mongoose.Types.ObjectId(productItemID),
        },
        { 'carts.$': 1 },
      );

      if (!cart || cart.carts.length === 0) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
      }
      g;
      const result = await CartModel.updateOne(
        { UserID: userId },
        {
          $pull: {
            carts: {
              productID: new mongoose.Types.ObjectId(productID),
              'productItemID._id': new mongoose.Types.ObjectId(productItemID),
            },
          },
        },
      );

      if (result.modifiedCount === 0) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không thể xóa sản phẩm khỏi giỏ hàng' });
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Xóa giỏ hàng thất bại',
        error: error.message,
      });
    }
  },

  increaseQuantity: async (req, res) => {
    const { productId, productItemId } = req.params;
    const userId = req.user._id;
    console.log(userId, productId, productItemId);
    try {
      const cart = await CartModel.findOneAndUpdate(
        {
          UserID: userId,
          'carts.productID': productId,
          'carts.productItemID': productItemId,
        },
        {
          $inc: { 'carts.$.quantity': 1 },
        },
        { new: true },
      );

      if (!cart) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không tìm thấy giỏ hàng hoặc sản phẩm.' });
      }

      res.status(StatusCodes.OK).json({
        data: cart,
        message: 'Tăng số lượng sản phẩm thành công.',
      });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Tăng số lượng thất bại', error: error.message });
    }
  },

  decreaseQuantity: async (req, res) => {
    const { productId, productItemId } = req.params;
    const userId = req.user._id;
    try {
      const cart = await CartModel.findOneAndUpdate(
        {
          UserID: userId,
          'carts.productID': productId,
          'carts.productItemID': productItemId,
        },
        {
          $inc: { 'carts.$.quantity': -1 },
        },
        { new: true },
      );

      if (!cart) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không tìm thấy giỏ hàng hoặc sản phẩm.' });
      }
      await CartModel.findOneAndUpdate(
        { UserID: userId },
        {
          $pull: {
            carts: {
              productID: productId,
              productItemID: new mongoose.Types.ObjectId(productItemId),
              quantity: { $lte: 0 },
            },
          },
        },
        { new: true },
      );

      res.status(StatusCodes.OK).json({
        data: cart,
        message: 'Giảm số lượng sản phẩm thành công.',
      });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Giảm số lượng thất bại', error: error.message });
    }
  },
};

export default CartController;

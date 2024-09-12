import { StatusCodes } from 'http-status-codes';
import WishlistModel from '../models/wishlist.js';
import { wishlistSchema } from '../validations/wishlist.js';

const WishlistController = {
  getAll: async (req, res) => {
    try {
      const wishlists = await WishlistModel.find();
      return res.status(StatusCodes.OK).json({
        message: 'Lấy danh sách yêu thích thành công',
        data: wishlists,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message,
      });
    }
  },

  getDetail: async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy danh sách yêu thích' });
    }
    try {
      const wishlist = await WishlistModel.findById(id);
      if (!wishlist) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Không tìm thấy danh sách yêu thích',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Lấy chi tiết danh sách yêu thích thành công',
        data: wishlist,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { value, error } = wishlistSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }
      const wishlist = await WishlistModel.create(value);
      return res.status(StatusCodes.CREATED).json({
        message: 'Tạo danh sách yêu thích thành công',
        data: wishlist,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  edit: async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Không tìm thấy danh sách yêu thích',
      });
    }
    try {
      const { error } = wishlistSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }
      const wishlist = await WishlistModel.findByIdAndUpdate(id, value, {
        new: true,
      });
      if (!wishlist) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Không tìm thấy danh sách yêu thích',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Cập nhật danh sách yêu thích thành công',
        data: wishlist,
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
        message: 'Không tìm thấy danh sách yêu thích',
      });
    }
    try {
      const wishlist = await WishlistModel.findByIdAndDelete(req.params.id);
      if (!wishlist) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Không tìm thấy danh sách yêu thích',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Xóa danh sách yêu thích thành công',
        data: wishlist,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
};

export default WishlistController;

import { StatusCodes } from 'http-status-codes';
import WishlistModel from '../models/wishlist.js';
import { wishlistSchema } from '../validations/wishlist.js';

const WishlistController = {
  getAll: async (req, res) => {
    try {
      const wishlists = await WishlistModel.find();
      return res.status(StatusCodes.OK).json({
        message: 'Get All Wishlist Done',
        data: wishlists,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message,
      });
    }
  },

  getDetail: async (req, res) => {
    try {
      const wishlist = await WishlistModel.findById(req.params.id);
      if (!wishlist) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Wishlist not found',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Get Detail Wishlist Done',
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
      const { error } = wishlistSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }
      const wishlist = await WishlistModel.create(req.body);
      return res.status(StatusCodes.CREATED).json({
        message: 'Create Wishlist Done',
        data: wishlist,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  edit: async (req, res) => {
    try {
      const { error } = wishlistSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }
      const wishlist = await WishlistModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!wishlist) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Wishlist not found',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Update Wishlist Done',
        data: wishlist,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const wishlist = await WishlistModel.findByIdAndDelete(req.params.id);
      if (!wishlist) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Wishlist not found',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Delete Wishlist Done',
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

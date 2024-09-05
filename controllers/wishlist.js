import { StatusCodes } from 'http-status-codes';
import WishlistModel from '../models/wishlist.js';
import { wishlistSchema } from '../validations/wishlist.js';

export const getAllWishlist = async (req, res) => {
  try {
    const wishlists = await WishlistModel.find();
    return res.status(StatusCodes.OK).json({
      message: 'Get All WishlistModel Done',
      data: wishlists,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const getDetailWishlist = async (req, res) => {
  try {
    const wishlist = await WishlistModel.findById(req.params.id);
    if (!wishlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'WishlistModel not found',
      });
    }
    return res.status(StatusCodes.OK).json({
      message: 'Get Detail WishlistModel Done',
      data: wishlist,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const createWishlist = async (req, res) => {
  try {
    const { error } = wishlistSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const wishlist = await WishlistModel.create(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: 'Create WishlistModel Done',
      data: wishlist,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const editWishlist = async (req, res) => {
  try {
    const { error } = wishlistSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const wishlist = await WishlistModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    if (!wishlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'WishlistModel not found',
      });
    }
    return res.status(StatusCodes.OK).json({
      message: 'Update WishlistModel Done',
      data: wishlist,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const deleteWishlist = async (req, res) => {
  try {
    const wishlist = await WishlistModel.findByIdAndDelete(req.params.id);
    if (!wishlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'WishlistModel not found',
      });
    }
    return res.status(StatusCodes.OK).json({
      message: 'Delete WishlistModel Done',
      data: wishlist,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

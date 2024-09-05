import { StatusCodes } from 'http-status-codes';
import Wishlist from '../models/wishlist.js';
import { wishlistSchema } from '../validations/wishlist.js';

export const getAllWishlist = async (req, res) => {
  try {
    const wishlists = await Wishlist.find();
    return res.status(StatusCodes.OK).json({
      message: 'Get All Wishlist Done',
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
    const wishlist = await Wishlist.findById(req.params.id);
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
    const wishlist = await Wishlist.create(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: 'Create Wishlist Done',
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
    const wishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
};

export const deleteWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findByIdAndDelete(req.params.id);
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
};

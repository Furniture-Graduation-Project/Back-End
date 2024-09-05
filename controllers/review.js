import { StatusCodes } from 'http-status-codes';
import ReviewModel from '../models/review.js';
import { reviewSchema } from '../validations/review.js';

export const getAllReview = async (req, res) => {
  try {
    const reviews = await ReviewModel.find();
    return res.status(StatusCodes.OK).json({
      message: 'Get All ReviewModel Done',
      data: reviews,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const getDetailReview = async (req, res) => {
  try {
    const review = await ReviewModel.findById(req.params.id);
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'ReviewModel not found',
      });
    }
    return res.status(StatusCodes.OK).json({
      message: 'Get Detail ReviewModel Done',
      data: review,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const review = await ReviewModel.create(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: 'Create ReviewModel Done',
      data: review,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const editReview = async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const review = await ReviewModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'ReviewModel not found',
      });
    }
    return res.status(StatusCodes.OK).json({
      message: 'Update ReviewModel Done',
      data: review,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await ReviewModel.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'ReviewModel not found',
      });
    }
    return res.status(StatusCodes.OK).json({
      message: 'Delete ReviewModel Done',
      data: review,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

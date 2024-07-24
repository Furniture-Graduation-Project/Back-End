import { StatusCodes } from "http-status-codes";
import Review from "../models/review.js";
import { crudValidate } from "../validations/review.js"; // Giả sử bạn có tệp validation cho review

export const getAllReview = async (req, res) => {
  try {
    const reviews = await Review.find();
    return res.status(StatusCodes.OK).json({
      message: "Get All Review Done",
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
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Review not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Get Detail Review Done",
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
    const { error } = crudValidate.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const review = await Review.create(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "Create Review Done",
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
    const { error } = crudValidate.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Review not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Update Review Done",
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
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Review not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Delete Review Done",
      data: review,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

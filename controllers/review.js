import { StatusCodes } from "http-status-codes";
import Review from "../models/review.js";
import { reviewSchema } from "../validations/review.js";

const ReviewController = {
  getAll: async (req, res) => {
    try {
      const reviews = await Review.find();
      return res.status(StatusCodes.OK).json({
        message: "Lấy tất cả bình luận thành công",
        data: reviews,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  getDetail: async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy bình luận" });
    }
    try {
      const review = await Review.findById(id);
      if (!review) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Bình luận không tìm thấy",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Lấy chi tiết bình luận thành công",
        data: review,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { value, error } = reviewSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Lỗi: " + errors.join(", "),
        });
      }
      const review = await Review.create(value);
      return res.status(StatusCodes.CREATED).json({
        message: "Tạo bình luận thành công",
        data: review,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  edit: async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy bình luận" });
    }
    try {
      const { value, error } = reviewSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Lỗi: " + errors.join(", "),
        });
      }
      const review = await Review.findByIdAndUpdate(id, value, {
        new: true,
      });
      if (!review) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Bình luận không tìm thấy",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Cập nhật bình luận thành công",
        data: review,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  delete: async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy bình luận" });
    }
    try {
      const review = await Review.findByIdAndDelete(id);
      if (!review) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Bình luận không tìm thấy",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Xóa bình luận thành công",
        data: review,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },
};

export default ReviewController;

import { StatusCodes } from 'http-status-codes';
import ReviewModel from '../models/review.js';
import { reviewSchema } from '../validations/review.js';

const ReviewController = {
  getAll: async (req, res) => {
    try {
      const reviews = await ReviewModel.find();
      return res.status(StatusCodes.OK).json({
        message: 'Lấy tất cả đánh giá thành công',
        data: reviews,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const review = await ReviewModel.findById(req.params.id);
      if (!review) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Không tìm thấy đánh giá',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Lấy chi tiết đánh giá thành công',
        data: review,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { error } = reviewSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Lỗi: ' + errors.join(', '),
        });
      }

      const review = await ReviewModel.create(req.body);
      return res.status(StatusCodes.CREATED).json({
        message: 'Tạo đánh giá thành công',
        data: review,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { error } = reviewSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Lỗi: ' + errors.join(', '),
        });
      }
      const review = await ReviewModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
      );
      if (!review) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Không tìm thấy đánh giá',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Cập nhật đánh giá thành công',
        data: review,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const review = await ReviewModel.findByIdAndDelete(req.params.id);
      if (!review) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Không tìm thấy đánh giá',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Xóa đánh giá thành công',
        data: review,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },
};

export default ReviewController;

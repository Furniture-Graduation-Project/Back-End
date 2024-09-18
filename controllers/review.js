import { StatusCodes } from 'http-status-codes';
import ReviewModel from '../models/review.js';
import { reviewSchema } from '../validations/review.js';

const ReviewController = {
  // Lấy tất cả đánh giá
  getAll: async (req, res) => {
    try {
      const reviews = await ReviewModel.find();
      return res.status(StatusCodes.OK).json({
        message: 'Lấy tất cả đánh giá thành công',
        data: reviews,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  // Lấy đánh giá theo ID
  getById: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy đánh giá' });
    }
    try {
      const review = await ReviewModel.findById(id);
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
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  // Tạo mới đánh giá
  create: async (req, res) => {
    try {
      const { value, error } = reviewSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Lỗi: ' + errors.join(', '),
        });
      }

      // Tạo đánh giá mới
      const review = await ReviewModel.create(value);
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

  // Cập nhật đánh giá theo ID
  update: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy đánh giá' });
    }
    try {
      const { value, error } = reviewSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Lỗi: ' + errors.join(', '),
        });
      }
      const review = await ReviewModel.findByIdAndUpdate(id, value, {
        new: true,
      });
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

  // Xóa đánh giá theo ID
  delete: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy đánh giá' });
    }
    try {
      const review = await ReviewModel.findByIdAndDelete(id);
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

  // Lấy tất cả đánh giá theo sản phẩm
  getReviewsByProductId: async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy sản phẩm' });
    }
    try {
      const reviews = await ReviewModel.find({ productId });
      if (reviews.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Không có đánh giá cho sản phẩm này.',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Lấy đánh giá cho sản phẩm thành công',
        data: reviews,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },
};

export default ReviewController;

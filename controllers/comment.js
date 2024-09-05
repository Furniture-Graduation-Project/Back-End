import { StatusCodes } from 'http-status-codes';
import Comment from '../models/comment.js';
import { commentSchema } from '../validations/comment.js';

const CommentController = {
  getAll: async (req, res) => {
    try {
      const comments = await Comment.find();
      return res.status(StatusCodes.OK).json({
        message: 'Lấy tất cả bình luận thành công',
        data: comments,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  getDetail: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Bình luận không tìm thấy',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Lấy chi tiết bình luận thành công',
        data: comment,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { error } = commentSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Lỗi: ' + errors.join(', '),
        });
      }
      const comment = await Comment.create(req.body);
      return res.status(StatusCodes.CREATED).json({
        message: 'Tạo bình luận thành công',
        data: comment,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  edit: async (req, res) => {
    try {
      const { error } = commentSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Lỗi: ' + errors.join(', '),
        });
      }
      const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!comment) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Bình luận không tìm thấy',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Cập nhật bình luận thành công',
        data: comment,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.id);
      if (!comment) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Bình luận không tìm thấy',
        });
      }
      return res.status(StatusCodes.OK).json({
        message: 'Xóa bình luận thành công',
        data: comment,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lỗi: ' + error.message,
      });
    }
  },
};

export default CommentController;

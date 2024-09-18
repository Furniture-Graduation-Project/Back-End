import Joi from 'joi';

export const reviewSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'Người dùng không được để trống',
    'string.empty': 'Người dùng không được để trống',
  }),
  productId: Joi.string().required().messages({
    'any.required': 'Sản phẩm không được để trống',
    'string.empty': 'Sản phẩm không được để trống',
  }),
  rating: Joi.number().min(0).max(5).required().messages({
    'any.required': 'Đánh giá không được để trống',
    'number.base': 'Đánh giá phải là một số',
    'number.min': 'Đánh giá không thể nhỏ hơn 0',
    'number.max': 'Đánh giá không thể lớn hơn 5',
  }),
  comment: Joi.string().trim().allow('').optional().messages({
    'string.base': 'Nội dung bình luận phải là một chuỗi',
  }),
  date: Joi.date().iso().required().messages({
    'any.required': 'Ngày bình luận không được để trống',
    'date.base': 'Ngày bình luận phải là một ngày hợp lệ',
  }),
});

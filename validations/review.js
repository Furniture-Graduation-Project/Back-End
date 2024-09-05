import Joi from 'joi';

export const reviewSchema = Joi.object({
  rating: Joi.string().required().messages({
    'any.required': 'Đánh giá không được để trống',
    'string.empty': 'Đánh giá không được để trống',
  }),
  commenttext: Joi.string().required().messages({
    'any.required': 'Nội dung bình luận không được để trống',
    'string.empty': 'Nội dung bình luận không được để trống',
  }),
  commentdate: Joi.string().required().messages({
    'any.required': 'Ngày bình luận không được để trống',
    'string.empty': 'Ngày bình luận không được để trống',
  }),
});

import Joi from 'joi';

export const commentSchema = Joi.object({
  productId: Joi.string().required().messages({
    'string.base': 'Mã sản phẩm phải là chuỗi ký tự',
    'string.empty': 'Mã sản phẩm không được để trống',
    'any.required': 'Mã sản phẩm là bắt buộc',
  }),
  userId: Joi.string().required().messages({
    'string.base': 'Mã người dùng phải là chuỗi ký tự',
    'string.empty': 'Mã người dùng không được để trống',
    'any.required': 'Mã người dùng là bắt buộc',
  }),
  rating: Joi.number().min(0).max(5).messages({
    'number.base': 'Đánh giá phải là một số',
    'number.min': 'Đánh giá không được nhỏ hơn 0',
    'number.max': 'Đánh giá không được lớn hơn 5',
  }),
  reviewText: Joi.string().optional().messages({
    'string.base': 'Nội dung đánh giá phải là chuỗi ký tự',
  }),
  reviewDate: Joi.date().optional().messages({
    'date.base': 'Ngày đánh giá phải là ngày hợp lệ',
  }),
});

import Joi from 'joi';

export const wishlistSchema = Joi.object({
  customerID: Joi.string().required().messages({
    'any.required': 'Mã khách hàng là bắt buộc',
    'string.empty': 'Mã khách hàng không được để trống',
  }),
  products: Joi.array().messages({
    'array.base': 'Sản phẩm phải là mảng',
  }),
});

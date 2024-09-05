import Joi from 'joi';

export const wishlistSchema = Joi.object({
  customerID: Joi.string().required().messages({
    'any.required': 'Mã khách hàng là bắt buộc',
    'string.empty': 'Mã khách hàng không được để trống',
  }),
  productID: Joi.string().required().messages({
    'any.required': 'Mã sản phẩm là bắt buộc',
    'string.empty': 'Mã sản phẩm không được để trống',
  }),
});

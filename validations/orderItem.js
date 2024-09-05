import Joi from 'joi';

export const orderItemSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'Mã sản phẩm là bắt buộc',
    'string.empty': 'Mã sản phẩm không được để trống',
  }),
  productOptionId: Joi.string().required().messages({
    'any.required': 'Mã tùy chọn sản phẩm là bắt buộc',
    'string.empty': 'Mã tùy chọn sản phẩm không được để trống',
  }),
  unitPrice: Joi.number().required().messages({
    'any.required': 'Giá đơn vị là bắt buộc',
    'number.base': 'Giá đơn vị phải là số',
  }),
  quantity: Joi.number().required().messages({
    'any.required': 'Số lượng là bắt buộc',
    'number.base': 'Số lượng phải là số',
  }),
});

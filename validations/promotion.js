import Joi from 'joi';

export const promotionSchema = Joi.object({
  description: Joi.string().required().messages({
    'any.required': 'Mô tả là bắt buộc',
    'string.empty': 'Mô tả không được để trống',
  }),
  type: Joi.string().valid('Percent', 'Fixed').required().messages({
    'any.required': 'Loại khuyến mại là bắt buộc',
    'any.only': 'Loại khuyên mại không hợp lệ',
  }),
  value: Joi.number().required().messages({
    'any.required': 'Giá trị là bắt buộc',
    'number.base': 'Giá trị phải là số',
  }),
  startDate: Joi.date().required().messages({
    'any.required': 'Ngày bắt đầu là bắt buộc',
    'date.base': 'Ngày bắt đầu không hợp lệ',
  }),
  endDate: Joi.date().required().messages({
    'any.required': 'Ngày kết thúc là bắt buộc',
    'date.base': 'Ngày kết thúc không hợp lệ',
  }),
  productID: Joi.string().optional().messages({
    'string.base': 'ID sản phẩm phải là chuỗi',
  }),
  categoryID: Joi.string().optional().messages({
    'string.base': 'ID danh mục phải là chuỗi',
  }),
});

import Joi from 'joi';

export const createCartSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'UserID là bắt buộc',
    'string.empty': 'UserID không được để trống',
  }),
  productId: Joi.string().required().messages({
    'any.required': 'ProductID là bắt buộc',
    'string.empty': 'ProductID không được để trống',
  }),
  quantity: Joi.number().min(1).required().messages({
    'any.required': 'Số lượng là bắt buộc',
    'number.base': 'Số lượng phải là một số',
    'number.min': 'Số lượng phải ít nhất là 1',
  }),
  price: Joi.number().required().messages({
    'any.required': 'Giá là bắt buộc',
    'number.base': 'Giá phải là một số',
  }),
  dateAdded: Joi.date().optional().messages({
    'date.base': 'Ngày thêm phải là một ngày hợp lệ',
  }),
}).options({
  abortEarly: false,
});

export const updateCartSchema = Joi.object({
  userId: Joi.string().optional().messages({
    'string.base': 'UserID phải là một chuỗi',
  }),
  productId: Joi.string().optional().messages({
    'string.base': 'ProductID phải là một chuỗi',
  }),
  quantity: Joi.number().min(1).optional().messages({
    'number.base': 'Số lượng phải là một số',
    'number.min': 'Số lượng phải ít nhất là 1',
  }),
  price: Joi.number().optional().messages({
    'number.base': 'Giá phải là một số',
  }),
  dateAdded: Joi.date().optional().messages({
    'date.base': 'Ngày thêm phải là một ngày hợp lệ',
  }),
}).options({
  abortEarly: false,
});

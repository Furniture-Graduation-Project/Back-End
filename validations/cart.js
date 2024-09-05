import Joi from 'joi';

export const createCartSchema = Joi.object({
  UserID: Joi.string().required().messages({
    'any.required': 'UserID là bắt buộc',
    'string.empty': 'UserID không được để trống',
  }),
  ProductID: Joi.string().required().messages({
    'any.required': 'ProductID là bắt buộc',
    'string.empty': 'ProductID không được để trống',
  }),
  Quantity: Joi.number().min(1).required().messages({
    'any.required': 'Số lượng là bắt buộc',
    'number.base': 'Số lượng phải là một số',
    'number.min': 'Số lượng phải ít nhất là 1',
  }),
  Price: Joi.number().required().messages({
    'any.required': 'Giá là bắt buộc',
    'number.base': 'Giá phải là một số',
  }),
  DateAdded: Joi.date().optional().messages({
    'date.base': 'Ngày thêm phải là một ngày hợp lệ',
  }),
}).options({
  abortEarly: false,
});

export const updateCartSchema = Joi.object({
  UserID: Joi.string().optional().messages({
    'string.base': 'UserID phải là một chuỗi',
  }),
  ProductID: Joi.string().optional().messages({
    'string.base': 'ProductID phải là một chuỗi',
  }),
  Quantity: Joi.number().min(1).optional().messages({
    'number.base': 'Số lượng phải là một số',
    'number.min': 'Số lượng phải ít nhất là 1',
  }),
  Price: Joi.number().optional().messages({
    'number.base': 'Giá phải là một số',
  }),
  DateAdded: Joi.date().optional().messages({
    'date.base': 'Ngày thêm phải là một ngày hợp lệ',
  }),
}).options({
  abortEarly: false,
});

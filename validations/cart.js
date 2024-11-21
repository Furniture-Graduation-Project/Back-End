import Joi from 'joi';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createCartSchema = Joi.object({
  productID: Joi.string().pattern(objectIdPattern).required().messages({
    'any.required': 'ProductID là bắt buộc',
    'string.empty': 'ProductID không được để trống',
    'string.pattern.base': 'ProductID phải là một ObjectId hợp lệ',
  }),
  productItemID: Joi.string().pattern(objectIdPattern).required().messages({
    'any.required': 'ProductItemID là bắt buộc',
    'string.empty': 'ProductItemID không được để trống',
    'string.pattern.base': 'ProductItemID phải là một ObjectId hợp lệ',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Số lượng là bắt buộc',
    'number.base': 'Số lượng phải là một số',
    'number.integer': 'Số lượng phải là một số nguyên',
    'number.min': 'Số lượng phải ít nhất là 1',
  }),
  price: Joi.number().greater(0).required().messages({
    'any.required': 'Giá là bắt buộc',
    'number.base': 'Giá phải là một số',
    'number.greater': 'Giá phải lớn hơn 0',
  }),
}).options({
  abortEarly: false,
});

export const updateCartSchema = Joi.object({
  productID: Joi.string().pattern(objectIdPattern).optional().messages({
    'string.empty': 'ProductID không được để trống',
    'string.pattern.base': 'ProductID phải là một ObjectId hợp lệ',
  }),
  productItemID: Joi.string().pattern(objectIdPattern).optional().messages({
    'string.empty': 'ProductItemID không được để trống',
    'string.pattern.base': 'ProductItemID phải là một ObjectId hợp lệ',
  }),
  quantity: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Số lượng phải là một số',
    'number.integer': 'Số lượng phải là một số nguyên',
    'number.min': 'Số lượng phải ít nhất là 1',
  }),
  price: Joi.number().greater(0).optional().messages({
    'number.base': 'Giá phải là một số',
    'number.greater': 'Giá phải lớn hơn 0',
  }),
}).options({
  abortEarly: false,
});

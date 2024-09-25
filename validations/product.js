import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Tên không được để trống',
    'string.empty': 'Tên không được để trống',
  }),
  description: Joi.string().optional().allow('').messages({
    'string.base': 'Mô tả phải là chuỗi ký tự',
  }),
  price: Joi.number().min(0).optional().messages({
    'number.base': 'Giá phải là số',
    'number.min': 'Giá phải lớn hơn hoặc bằng 0',
  }),
  quantity: Joi.number().min(0).optional().messages({
    'number.base': 'Số lượng phải là số',
    'number.min': 'Số lượng phải lớn hơn hoặc bằng 0',
  }),
  category: Joi.string().optional().allow('').messages({
    'string.base': 'Danh mục phải là chuỗi ký tự',
  }),
  images: Joi.array().min(1).required().messages({
    'any.required': 'Hình ảnh không được để trống',
    'string.empty': 'Hình ảnh không được để trống',
  }),
  createdAt: Joi.number().min(0).optional().messages({
    'number.base': 'Thời gian tạo phải là số',
    'number.min': 'Thời gian tạo phải lớn hơn hoặc bằng 0',
  }),
}).options({
  abortEarly: false,
});

export const updateProductSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Tên không được để trống',
    'string.empty': 'Tên không được để trống',
  }),
  description: Joi.string().optional().allow('').messages({
    'string.base': 'Mô tả phải là chuỗi ký tự',
  }),
  price: Joi.number().min(0).required().messages({
    'any.required': 'Giá không được để trống',
    'number.base': 'Giá phải là số',
    'number.min': 'Giá phải lớn hơn hoặc bằng 0',
  }),
  quantity: Joi.number().required().messages({
    'any.required': 'Số lượng không được để trống',
    'number.base': 'Số lượng phải là số',
  }),
  category: Joi.string().required().messages({
    'any.required': 'Danh mục không được để trống',
    'string.empty': 'Danh mục không được để trống',
  }),
  images: Joi.array().min(1).required().messages({
    'any.required': 'Hình ảnh không được để trống',
    'string.empty': 'Hình ảnh không được để trống',
  }),
  createdAt: Joi.number().messages({
    'any.required': 'Thời gian tạo không được để trống',
    'number.base': 'Thời gian tạo phải là số',
  }),
}).options({
  abortEarly: false,
});

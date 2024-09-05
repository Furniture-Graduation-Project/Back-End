import Joi from 'joi';

export const createCategorySchema = Joi.object({
  categoryName: Joi.string().required().messages({
    'any.required': 'Tên danh mục là bắt buộc',
    'string.empty': 'Tên danh mục không được để trống',
  }),
  description: Joi.string().min(0).optional().messages({
    'string.base': 'Mô tả phải là một chuỗi',
  }),
  dateCreated: Joi.number().min(0).optional().messages({
    'number.base': 'Ngày tạo phải là một số',
    'number.min': 'Ngày tạo phải ít nhất là 0',
  }),
  dateModified: Joi.number().min(0).optional().messages({
    'number.base': 'Ngày chỉnh sửa phải là một số',
    'number.min': 'Ngày chỉnh sửa phải ít nhất là 0',
  }),
}).options({
  abortEarly: false,
});

export const updateCategorySchema = Joi.object({
  categoryName: Joi.string().required().messages({
    'any.required': 'Tên danh mục là bắt buộc',
    'string.empty': 'Tên danh mục không được để trống',
  }),
  description: Joi.string().allow('').optional().messages({
    'string.base': 'Mô tả phải là một chuỗi',
  }),
  dateModified: Joi.number().messages({
    'number.base': 'Ngày chỉnh sửa phải là một số',
  }),
  dateCreated: Joi.number().messages({
    'number.base': 'Ngày tạo phải là một số',
  }),
}).options({
  abortEarly: false,
});

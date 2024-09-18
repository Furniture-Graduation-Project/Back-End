import Joi from "joi";

export const createCategorySchema = Joi.object({
  categoryName: Joi.string().required().messages({
    "any.required": "Tên danh mục là bắt buộc",
    "string.empty": "Tên danh mục không được để trống",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là một chuỗi",
  }),
  role: Joi.number().valid(0, 1).default(0).messages({
    "number.base": "Role phải là một số",
    "any.only": "Role chỉ có thể là 0 hoặc 1",
  }),
}).options({
  abortEarly: false,
});

export const updateCategorySchema = Joi.object({
  categoryName: Joi.string().optional().messages({
    "string.base": "Tên danh mục phải là một chuỗi",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là một chuỗi",
  }),
  role: Joi.number().valid(0, 1).optional().messages({
    "number.base": "Role phải là một số",
    "any.only": "Role chỉ có thể là 0 hoặc 1",
  }),
}).options({
  abortEarly: false,
});

import Joi from "joi";

export const createCategorySchema = Joi.object({
  categoryName: Joi.string().trim().required().messages({
    "any.required": "Tên danh mục là bắt buộc.",
    "string.empty": "Tên danh mục không được để trống.",
    "string.base": "Tên danh mục phải là một chuỗi.",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là một chuỗi.",
  }),
});

export const updateCategorySchema = Joi.object({
  categoryName: Joi.string().trim().optional().messages({
    "string.empty": "Tên danh mục không được để trống.",
    "string.base": "Tên danh mục phải là một chuỗi.",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là một chuỗi.",
  }),
});

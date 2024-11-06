import Joi from "joi";

export const createMaterialSchema = Joi.object({
  materialName: Joi.string().trim().required().messages({
    "any.required": "Tên chất liệu là bắt buộc.",
    "string.empty": "Tên chất liệu không được để trống.",
    "string.base": "Tên chất liệu phải là một chuỗi.",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là một chuỗi.",
  }),
});

export const updateMaterialSchema = Joi.object({
  materialName: Joi.string().trim().optional().messages({
    "string.empty": "Tên chất liệu không được để trống.",
    "string.base": "Tên chất liệu phải là một chuỗi.",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là một chuỗi.",
  }),
});

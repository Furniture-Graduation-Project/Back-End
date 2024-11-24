import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Tên sản phẩm là bắt buộc.",
    "string.empty": "Tên sản phẩm không được để trống.",
    "string.base": "Tên sản phẩm phải là chuỗi ký tự.",
  }),
  category: Joi.string().required().messages({
    "any.required": "Danh mục sản phẩm là bắt buộc.",
    "string.empty": "Danh mục sản phẩm không được để trống.",
    "string.base": "Danh mục sản phẩm phải là chuỗi ký tự.",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là chuỗi ký tự.",
  }),
  images: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Hình ảnh phải là mảng các chuỗi ký tự.",
    "string.base": "Mỗi hình ảnh phải là chuỗi ký tự.",
  }),
  material: Joi.string().optional().allow("").messages({
    "string.base": "Chất liệu phải là chuỗi ký tự.",
  }),
  materialDetail: Joi.string().optional().allow("").messages({
    "string.base": "Chi tiết chất liệu phải là chuỗi ký tự.",
  }),
  status: Joi.string()
    .valid("creating", "avaliable", "disable")
    .optional()
    .messages({
      "string.base": "Trạng thái phải là chuỗi ký tự.",
      "any.only": "Trạng thái không hợp lệ.",
    }),
}).options({
  abortEarly: false,
});

export const updateProductSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Tên sản phẩm phải là chuỗi ký tự.",
  }),
  category: Joi.string().optional().messages({
    "string.base": "Danh mục sản phẩm phải là chuỗi ký tự.",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là chuỗi ký tự.",
  }),
  images: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Hình ảnh phải là mảng các chuỗi ký tự.",
    "string.base": "Mỗi hình ảnh phải là chuỗi ký tự.",
  }),
  material: Joi.string().optional().allow("").messages({
    "string.base": "Chất liệu phải là chuỗi ký tự.",
  }),
  materialDetail: Joi.string().optional().allow("").messages({
    "string.base": "Chi tiết chất liệu phải là chuỗi ký tự.",
  }),
  status: Joi.string()
    .valid("creating", "avaliable", "disable")
    .optional()
    .messages({
      "string.base": "Trạng thái phải là chuỗi ký tự.",
      "any.only": "Trạng thái không hợp lệ.",
    }),
}).options({
  abortEarly: false,
});

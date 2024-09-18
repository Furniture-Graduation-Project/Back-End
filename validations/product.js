import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Tên sản phẩm là bắt buộc",
    "string.empty": "Tên sản phẩm không được để trống",
  }),
  title: Joi.string().required().messages({
    "any.required": "Tiêu đề sản phẩm là bắt buộc",
    "string.empty": "Tiêu đề sản phẩm không được để trống",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là chuỗi ký tự",
  }),
  price: Joi.number().min(0).required().messages({
    "any.required": "Giá sản phẩm là bắt buộc",
    "number.base": "Giá sản phẩm phải là số",
    "number.min": "Giá sản phẩm phải lớn hơn hoặc bằng 0",
  }),
  quantity: Joi.number().min(0).required().messages({
    "any.required": "Số lượng sản phẩm là bắt buộc",
    "number.base": "Số lượng sản phẩm phải là số",
    "number.min": "Số lượng sản phẩm phải lớn hơn hoặc bằng 0",
  }),
  categoryID: Joi.string().required().messages({
    "any.required": "Danh mục sản phẩm là bắt buộc",
    "string.empty": "Danh mục sản phẩm không được để trống",
  }),
  colors: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Màu sắc phải là mảng các chuỗi ký tự",
    "string.base": "Mỗi màu sắc phải là chuỗi ký tự",
  }),
  sizes: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Kích thước phải là mảng các chuỗi ký tự",
    "string.base": "Mỗi kích thước phải là chuỗi ký tự",
  }),
  brand: Joi.string().required().messages({
    "any.required": "Thương hiệu sản phẩm là bắt buộc",
    "string.empty": "Thương hiệu sản phẩm không được để trống",
  }),
  images: Joi.array().items(Joi.string()).min(1).required().messages({
    "any.required": "Hình ảnh sản phẩm là bắt buộc",
    "array.base": "Hình ảnh phải là mảng các chuỗi ký tự",
    "array.min": "Cần ít nhất 1 hình ảnh",
    "string.base": "Mỗi hình ảnh phải là chuỗi ký tự",
  }),
  createdAt: Joi.date().optional().messages({
    "date.base": "Ngày tạo phải là ngày hợp lệ",
  }),
}).options({
  abortEarly: false,
});

export const updateProductSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Tên sản phẩm phải là chuỗi ký tự",
  }),
  title: Joi.string().optional().messages({
    "string.base": "Tiêu đề sản phẩm phải là chuỗi ký tự",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Mô tả phải là chuỗi ký tự",
  }),
  price: Joi.number().min(0).optional().messages({
    "number.base": "Giá sản phẩm phải là số",
    "number.min": "Giá sản phẩm phải lớn hơn hoặc bằng 0",
  }),
  quantity: Joi.number().min(0).optional().messages({
    "number.base": "Số lượng sản phẩm phải là số",
    "number.min": "Số lượng sản phẩm phải lớn hơn hoặc bằng 0",
  }),
  categoryID: Joi.string().optional().messages({
    "string.base": "Danh mục sản phẩm phải là chuỗi ký tự",
  }),
  colors: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Màu sắc phải là mảng các chuỗi ký tự",
    "string.base": "Mỗi màu sắc phải là chuỗi ký tự",
  }),
  sizes: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Kích thước phải là mảng các chuỗi ký tự",
    "string.base": "Mỗi kích thước phải là chuỗi ký tự",
  }),
  brand: Joi.string().optional().messages({
    "string.base": "Thương hiệu sản phẩm phải là chuỗi ký tự",
  }),
  images: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Hình ảnh phải là mảng các chuỗi ký tự",
    "string.base": "Mỗi hình ảnh phải là chuỗi ký tự",
  }),
  createdAt: Joi.date().optional().messages({
    "date.base": "Ngày tạo phải là ngày hợp lệ",
  }),
}).options({
  abortEarly: false,
});

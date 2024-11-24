import Joi from "joi";

const variantSchema = Joi.object({
  variant: Joi.string().trim().required().messages({
    "string.base": `Giá trị phải là một chuỗi ký tự`,
    "string.empty": `Giá trị không được để trống`,
    "any.required": `Trường variant là bắt buộc`,
  }),
  value: Joi.string().trim().required().messages({
    "string.base": `Giá trị phải là một chuỗi ký tự`,
    "string.empty": `Giá trị không được để trống`,
    "any.required": `Trường value là bắt buộc`,
  }),
});

export const productItemSchema = Joi.object({
  productId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": `Mã sản phẩm phải là một ObjectId hợp lệ`,
      "any.required": `Trường productId là bắt buộc`,
    }),
  variants: Joi.array().items(variantSchema).required().messages({
    "array.base": `Danh sách biến thể phải là một mảng`,
    "any.required": `Trường variants là bắt buộc`,
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": `Số lượng tồn kho phải là một số nguyên`,
    "number.min": `Số lượng tồn kho phải lớn hơn hoặc bằng 0`,
    "any.required": `Trường stock là bắt buộc`,
  }),
  outStock: Joi.number().integer().min(0).required().messages({
    "number.base": `Số lượng tồn kho phải là một số nguyên`,
    "number.min": `Số lượng tồn kho phải lớn hơn hoặc bằng 0`,
    "any.required": `Trường outStock là bắt buộc`,
  }),
  price: Joi.number().greater(0).required().messages({
    "number.base": `Giá phải là một số`,
    "number.greater": `Giá phải lớn hơn 0`,
    "any.required": `Trường price là bắt buộc`,
  }),
  image: Joi.string().allow("").optional().messages({
    "string.base": `Ảnh phải là một chuỗi ký tự`,
  }),
  SKU: Joi.string().required().messages({
    "any.required": "SKU là bắt buộc.",
    "string.empty": "SKU không được để trống.",
    "string.base": "SKU phải là chuỗi ký tự.",
  }),
});

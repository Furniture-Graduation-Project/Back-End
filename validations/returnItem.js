import Joi from "joi";

export const returnItemSchema = Joi.object({
  productOptionId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Mã sản phẩm không hợp lệ",
      "any.required": "Mã sản phẩm là bắt buộc",
    }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Số lượng phải là một số nguyên",
    "number.min": "Số lượng phải lớn hơn hoặc bằng 1",
    "any.required": "Số lượng là bắt buộc",
  }),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending")
    .messages({
      "any.only": "Trạng thái phải là pending, approved, hoặc rejected",
      "any.required": "Trạng thái là bắt buộc",
    }),
});
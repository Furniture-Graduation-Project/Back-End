import Joi from "joi";

export const schemaGoogleSheet = Joi.object({
  mail: Joi.string().email().required().messages({
    "string.base": "Email phải là một chuỗi.",
    "string.email": "Email không hợp lệ.",
    "any.required": "Email là bắt buộc.",
  }),
});

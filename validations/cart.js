import Joi from "joi";

// Schema cho việc tạo mới giỏ hàng
const createValidate = Joi.object({
  UserID: Joi.string().required().messages({
    "any.required": "UserID is required",
    "string.empty": "UserID cannot be empty",
  }),
  ProductID: Joi.string().required().messages({
    "any.required": "ProductID is required",
    "string.empty": "ProductID cannot be empty",
  }),
  Quantity: Joi.number().min(1).required().messages({
    "any.required": "Quantity is required",
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
  }),
  Price: Joi.number().required().messages({
    "any.required": "Price is required",
    "number.base": "Price must be a number",
  }),
  DateAdded: Joi.date().optional().messages({
    "date.base": "DateAdded must be a valid date",
  }),
}).options({
  abortEarly: false,
});

// Schema cho việc cập nhật giỏ hàng
const updateValidate = Joi.object({
  UserID: Joi.string().optional().messages({
    "string.base": "UserID must be a string",
  }),
  ProductID: Joi.string().optional().messages({
    "string.base": "ProductID must be a string",
  }),
  Quantity: Joi.number().min(1).optional().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
  }),
  Price: Joi.number().optional().messages({
    "number.base": "Price must be a number",
  }),
  DateAdded: Joi.date().optional().messages({
    "date.base": "DateAdded must be a valid date",
  }),
}).options({
  abortEarly: false,
});

export { createValidate, updateValidate };

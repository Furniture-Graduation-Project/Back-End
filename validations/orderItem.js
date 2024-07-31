import Joi from "joi";

export const orderItemSchema = Joi.object({
  productId: Joi.string().required().messages({
    "any.required": "Product ID is required",
    "string.empty": "Product ID cannot be empty",
  }),
  productOptionId: Joi.string().required().messages({
    "any.required": "Product option ID is required",
    "string.empty": "Product option ID cannot be empty",
  }),
  unitPrice: Joi.number().required().messages({
    "any.required": "Unit price is required",
    "number.base": "Unit price must be a number",
  }),
  quantity: Joi.number().required().messages({
    "any.required": "Quantity is required",
    "number.base": "Quantity must be a number",
  }),
});

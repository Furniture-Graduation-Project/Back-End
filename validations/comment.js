import Joi from "joi";

const crudValidate = Joi.object({
  productId: Joi.string().required().messages({
    "string.base": "Product ID should be a type of text",
    "string.empty": "Product ID cannot be empty",
    "any.required": "Product ID is required",
  }),
  userId: Joi.string().required().messages({
    "string.base": "User ID should be a type of text",
    "string.empty": "User ID cannot be empty",
    "any.required": "User ID is required",
  }),
  rating: Joi.number().min(0).max(5).messages({
    "number.base": "Rating should be a type of number",
    "number.min": "Rating cannot be less than 0",
    "number.max": "Rating cannot be more than 5",
  }),
  reviewText: Joi.string().optional().messages({
    "string.base": "Review text should be a type of text",
  }),
  reviewDate: Joi.date().optional().messages({
    "date.base": "Review date should be a valid date",
  }),
});

export { crudValidate };

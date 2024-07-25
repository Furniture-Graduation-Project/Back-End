import Joi from "joi";

export const cartValidation = Joi.object({
  UserID: Joi.string().required().messages({
    "string.base": `"UserID" should be a type of 'text'`,
    "string.empty": `"UserID" cannot be an empty field`,
    "any.required": `"UserID" is a required field`,
  }),
  items: Joi.array().items(
    Joi.object({
      ProductID: Joi.string().required().messages({
        "string.base": `"ProductID" should be a type of 'text'`,
        "string.empty": `"ProductID" cannot be an empty field`,
        "any.required": `"ProductID" is a required field`,
      }),
      ProductOption: Joi.string().required().messages({
        "string.base": `"ProductOption" should be a type of 'text'`,
        "string.empty": `"ProductOption" cannot be an empty field`,
        "any.required": `"ProductOption" is a required field`,
      }),
      Quantity: Joi.number().integer().min(1).required().messages({
        "number.base": `"Quantity" should be a type of 'number'`,
        "number.integer": `"Quantity" must be an integer`,
        "number.min": `"Quantity" must be greater than or equal to 1`,
        "any.required": `"Quantity" is a required field`,
      }),
      Price: Joi.number().min(0).required().messages({
        "number.base": `"Price" should be a type of 'number'`,
        "number.min": `"Price" must be greater than or equal to 0`,
        "any.required": `"Price" is a required field`,
      }),
      DateAdded: Joi.date().default(Date.now).messages({
        "date.base": `"DateAdded" should be a type of 'date'`,
      }),
    })
  ),
});

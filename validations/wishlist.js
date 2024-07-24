import Joi from "joi";

const crudValidate = Joi.object({
  customerID: Joi.string().required().messages({
    "any.required": "Customer ID không được để trống",
    "string.empty": "Customer ID không được để trống",
  }),
  productID: Joi.string().required().messages({
    "any.required": "Product ID không được để trống",
    "string.empty": "Product ID không được để trống",
  }),
});

export { crudValidate };

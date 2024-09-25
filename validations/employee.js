import Joi from "joi";

const crudValidate = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "Email không được để trống",
    "string.empty": "Email không được để trống",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password không được để trống",
    "string.empty": "Password không được để trống",
  }),
  fullName: Joi.string().required().messages({
    "any.required": "FullName không được để trống",
    "string.empty": "FullName không được để trống",
  }),
  phoneNumber: Joi.number().required().messages({
    "any.required": "PhoneNumber không được để trống",
    "number.base": "PhoneNumber phải là số",
    "number.empty": "PhoneNumber không được để trống",
  }),
  address: Joi.string().required().messages({
    "any.required": "Address không được để trống",
    "string.empty": "Address không được để trống",
  }),
  role: Joi.string(),
});

export { crudValidate };

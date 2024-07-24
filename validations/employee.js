import Joi from "joi";

const crudValidate = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username không được để trống",
    "string.empty": "Username không được để trống",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password không được để trống",
    "string.empty": "Password không được để trống",
  }),
  fullname: Joi.string().required().messages({
    "any.required": "Fullname không được để trống",
    "string.empty": "Fullname không được để trống",
  }),
  phonenumber: Joi.number().required().messages({
    "any.required": "Phonenumber không được để trống",
    "number.base": "Phonenumber phải là số",
    "number.empty": "Phonenumber không được để trống",
  }),
  address: Joi.string().required().messages({
    "any.required": "Address không được để trống",
    "string.empty": "Address không được để trống",
  }),
  role: Joi.string().required().messages({
    "any.required": "Role không được để trống",
    "string.empty": "Role không được để trống",
  }),
});

export { crudValidate };

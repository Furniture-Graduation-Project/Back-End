import Joi from "joi";

export const employeeSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Tên người dùng không được để trống",
    "string.empty": "Tên người dùng không được để trống",
  }),
  password: Joi.string().required().messages({
    "any.required": "Mật khẩu không được để trống",
    "string.empty": "Mật khẩu không được để trống",
  }),
  fullName: Joi.string().required().messages({
    "any.required": "Họ tên không được để trống",
    "string.empty": "Họ tên không được để trống",
  }),
  phoneNumber: Joi.number().required().messages({
    "any.required": "Số điện thoại không được để trống",
    "number.base": "Số điện thoại phải là số",
    "number.empty": "Số điện thoại không được để trống",
  }),
  address: Joi.string().required().messages({
    "any.required": "Địa chỉ không được để trống",
    "string.empty": "Địa chỉ không được để trống",
  }),
  role: Joi.string().required().messages({
    "any.required": "Vai trò không được để trống",
    "string.empty": "Vai trò không được để trống",
  }),
});

export const signinSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Tên người dùng không được để trống",
    "string.empty": "Tên người dùng không được để trống",
  }),
  password: Joi.string().required().messages({
    "any.required": "Mật khẩu không được để trống",
    "string.empty": "Mật khẩu không được để trống",
  }),
});

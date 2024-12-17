import Joi from "joi";

export const employeeSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username không được để trống",
    "string.empty": "Username không được để trống",
  }),
  password: Joi.string().optional().messages({
    "string.empty": "Mật khẩu không được để trống",
  }),
  avatar: Joi.string().optional().messages({
    "string.empty": "Ảnh dại diện không được để trống",
  }),
  fullName: Joi.string().messages({
    "string.empty": "Họ tên không được để trống",
  }),
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/, "Số điện thoại")
    .messages({
      "string.empty": "Số điện thoại không được để trống",
      "string.length": "Số điện thoại phải đúng 10 ký tự",
      "string.pattern.base": "Số điện thoại chỉ được chứa các chữ số",
    })
    .optional(),
  address: Joi.string().messages({
    "string.empty": "Địa chỉ không được để trống",
  }),
  role: Joi.string().optional().messages({
    "string.empty": "Vai trò không được để trống",
  }),
});

export const signinEmployeeSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.email": "Email không đúng định dạng",
    "string.empty": "Email không được để trống",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "Mật khẩu phải có ít nhất 8 ký tự",
    "string.empty": "Mật khẩu không được để trống",
  }),
});

export const updateEmployeePassword = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": "Mật khẩu cũ không được để trống",
    "string.empty": "Mật khẩu cũ không được để trống",
  }),
  newPassword: Joi.string().required().messages({
    "any.required": "Mật khẩu mới không được để trống",
    "string.empty": "Mật khẩu mới không được để trống",
  }),
});

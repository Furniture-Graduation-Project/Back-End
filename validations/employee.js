import Joi from 'joi';

export const employeeSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username không được để trống',
    'string.empty': 'Username không được để trống',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Mật khẩu không được để trống',
    'string.empty': 'Mật khẩu không được để trống',
  }),
  avatar: Joi.string().messages({
    'string.empty': 'Ảnh dại diện  không được để trống',
  }),
  fullName: Joi.string().messages({
    'string.empty': 'Họ tên không được để trống',
  }),
  phoneNumber: Joi.string().min(10).max(15).messages({
    'string.empty': 'Số điện thoại không được để trống',
    'string.min': 'Số điện thoại lớn hơn 10 ký tự',
    'string.max': 'Số điện thoại nhỏ hơn 15 ký tự',
  }),
  address: Joi.string().messages({
    'string.empty': 'Địa chỉ không được để trống',
  }),
  role: Joi.string().required().messages({
    'any.required': 'Vai trò là bắt buộc',
    'string.empty': 'Vai trò không được để trống',
  }),
});
export const signinEmployeeSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.email': 'Email không đúng định dạng',
    'string.empty': 'Email không được để trống',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
    'string.empty': 'Mật khẩu không được để trống',
  }),
});

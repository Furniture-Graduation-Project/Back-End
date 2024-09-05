import Joi from 'joi';

export const signupSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Tên không được để trống',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email không đúng định dạng',
    'string.empty': 'Email không được để trống',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
    'string.empty': 'Mật khẩu không được để trống',
  }),
  confirmPassword: Joi.string()
    .min(8)
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Mật khẩu xác nhận không khớp',
      'string.min': 'Mật khẩu xác nhận phải có ít nhất 8 ký tự',
      'string.empty': 'Mật khẩu xác nhận không được để trống',
    }),
});

export const signinSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email không đúng định dạng',
    'string.empty': 'Email không được để trống',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
    'string.empty': 'Mật khẩu không được để trống',
  }),
});

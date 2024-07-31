import Joi from 'joi';

export const locationSchema = Joi.object({
    street: Joi.string().required().messages({
        "string.empty": "Vui lòng nhập địa chỉ !",
        "string.required": "Vui lòng nhập địa chỉ !",
    }),
    city: Joi.string().required().messages({
        "string.empty": "Vui lòng nhập thành phố !",
    }),
    state: Joi.string(),
    postalCode: Joi.string().required().messages({
        "string.empty": "Vui lòng nhập mã bưu điện !",
    }),
    country: Joi.string().required().messages({
        "string.empty": "Vui lòng nhập quốc gia !",
    }),
    recipientName: Joi.string().required().messages({
        "string.empty": "Vui lòng nhập tên người nhận !",
    }),
    phoneNumber: Joi.string().required().messages({
        "string.empty": "Vui lòng nhập số điện thoại !",
    }),
    userId: Joi.string().required().messages({
        "string.empty": "Vui lòng nhập ID người dùng !",
    }),
});
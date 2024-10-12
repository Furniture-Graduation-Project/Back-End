import Joi from 'joi';

export const messageSchema = Joi.object({
  content: Joi.string().required().messages({
    'string.base': 'Nội dung tin nhắn phải là một chuỗi.',
    'string.empty': 'Nội dung tin nhắn không được để trống.',
    'any.required': 'Nội dung tin nhắn là bắt buộc.',
  }),
  status: Joi.string()
    .valid('sent', 'read')
    .default('sent')
    .required()
    .messages({
      'string.base': 'Trạng thái tin nhắn phải là một chuỗi.',
      'any.only':
        'Trạng thái tin nhắn phải là một trong các giá trị: sent, read.',
    }),

  type: Joi.string()
    .valid('text', 'product', 'voucher')
    .default('text')
    .required()
    .messages({
      'string.base': 'Trạng thái tin nhắn phải là một chuỗi.',
      'any.only':
        'Trạng thái tin nhắn phải là một trong các giá trị: text, image, product, voucher.',
    }),

  sender: Joi.object({
    senderId: Joi.string().required().messages({
      'string.base': 'ID người gửi phải là một chuỗi.',
      'string.empty': 'ID người gửi không được để trống.',
      'any.required': 'ID người gửi là bắt buộc.',
    }),
    senderType: Joi.string().required().messages({
      'string.base': 'Loại người gửi phải là một chuỗi.',
      'string.empty': 'Loại người gửi không được để trống.',
      'any.required': 'Loại người gửi là bắt buộc.',
    }),
    name: Joi.string().required().messages({
      'string.base': 'Tên người gửi phải là một chuỗi.',
      'string.empty': 'Tên người gửi không được để trống.',
      'any.required': 'Tên người gửi là bắt buộc.',
    }),
  })
    .required()
    .messages({
      'object.base': 'Thông tin người gửi phải là một đối tượng.',
      'object.empty': 'Thông tin người gửi không được để trống.',
      'any.required': 'Thông tin người gửi là bắt buộc.',
    }),
  timestamp: Joi.date().messages({
    'date.base': 'Thời gian gửi tin nhắn phải là một ngày hợp lệ.',
  }),
});

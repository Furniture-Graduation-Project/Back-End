import Joi from 'joi';
import { messageSchema } from './message.js';

export const createConversationSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID người dùng không hợp lệ.',
      'any.required': 'ID người dùng là bắt buộc.',
    }),
  messages: Joi.array().items(messageSchema).optional().messages({
    'array.base': 'Danh sách tin nhắn không hợp lệ.',
  }),
  star: Joi.boolean().default(false).messages({
    'boolean.base': 'Giá trị ngôi sao phải là kiểu Boolean.',
  }),
  label: Joi.string()
    .valid('service', 'feedback', 'order')
    .default('service')
    .messages({
      'any.only':
        'Nhãn phải là một trong các giá trị: service, feedback, order.',
      'string.base': 'Nhãn phải là một chuỗi ký tự.',
    }),
});

export const updateConversationSchema = Joi.object({
  messages: Joi.array().items(messageSchema).optional().messages({
    'array.base': 'Danh sách tin nhắn không hợp lệ.',
  }),
  star: Joi.boolean().optional().messages({
    'boolean.base': 'Giá trị ngôi sao phải là kiểu Boolean.',
  }),
  label: Joi.string()
    .valid('service', 'feedback', 'order')
    .optional()
    .messages({
      'any.only':
        'Nhãn phải là một trong các giá trị: service, feedback, order.',
      'string.base': 'Nhãn phải là một chuỗi ký tự.',
    }),
});

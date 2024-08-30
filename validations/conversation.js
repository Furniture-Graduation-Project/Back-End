import Joi from 'joi';
import messageValidate from './message.js';

const createConversationValidate = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID người dùng không hợp lệ.',
      'any.required': 'ID người dùng là bắt buộc.',
    }),
  messages: Joi.array().items(messageValidate).optional().messages({
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
  status: Joi.string()
    .valid('normal', 'spam', 'important', 'deleted')
    .default('normal')
    .messages({
      'any.only':
        'Trạng thái phải là một trong các giá trị: normal, spam, important, deleted.',
      'string.base': 'Trạng thái phải là một chuỗi ký tự.',
    }),
  category: Joi.string()
    .valid('inbox', 'sent', 'draft')
    .default('draft')
    .messages({
      'any.only': 'Danh mục phải là một trong các giá trị: inbox, sent, draft.',
      'string.base': 'Danh mục phải là một chuỗi ký tự.',
    }),
});

const updateConversationValidate = Joi.object({
  messages: Joi.array().items(messageValidate).optional().messages({
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
  status: Joi.string()
    .valid('normal', 'spam', 'important', 'deleted')
    .optional()
    .messages({
      'any.only':
        'Trạng thái phải là một trong các giá trị: normal, spam, important, deleted.',
      'string.base': 'Trạng thái phải là một chuỗi ký tự.',
    }),
  category: Joi.string().valid('inbox', 'sent', 'draft').optional().messages({
    'any.only': 'Danh mục phải là một trong các giá trị: inbox, sent, draft.',
    'string.base': 'Danh mục phải là một chuỗi ký tự.',
  }),
});

export { createConversationValidate, updateConversationValidate };
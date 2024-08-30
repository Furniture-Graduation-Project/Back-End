import Joi from 'joi';
const createValidate = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty',
  }),
  description: Joi.string().optional().allow('').messages({
    'string.base': 'Description must be a string',
  }),
  price: Joi.number().min(0).optional().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least 0',
  }),
  quantity: Joi.number().min(0).optional().messages({
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity must be at least 0',
  }),
  category: Joi.string().optional().allow('').messages({
    'string.base': 'Category must be a string',
  }),
  images: Joi.array().min(1).required().messages({
    'any.required': 'Images are required',
    'string.empty': 'Images cannot be empty',
  }),
  createdAt: Joi.number().min(0).optional().messages({
    'number.base': 'CreatedAt must be a number',
    'number.min': 'CreatedAt must be at least 0',
  }),
}).options({
  abortEarly: false,
});
const updateValidate = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty',
  }),
  description: Joi.string().optional().allow('').messages({
    'string.base': 'Description must be a string',
  }),
  price: Joi.number().min(0).required().messages({
    'any.required': 'Price is required',
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least 0',
  }),
  quantity: Joi.number().required().messages({
    'any.required': 'Quantity is required',
    'number.base': 'Quantity must be a number',
  }),
  category: Joi.string().required().messages({
    'any.required': 'Category is required',
    'string.empty': 'Category cannot be empty',
  }),
  images: Joi.array().min(1).required().messages({
    'any.required': 'Images are required',
    'string.empty': 'Images cannot be empty',
  }),
  createdAt: Joi.number().messages({
    'any.required': 'CreatedAt is required',
    'number.base': 'CreatedAt must be a number',
  }),
}).options({
  abortEarly: false,
});

export { createValidate, updateValidate };

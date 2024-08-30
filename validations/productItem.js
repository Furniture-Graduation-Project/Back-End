import Joi from 'joi';

const variantSchema = Joi.object({
  variant: Joi.string().trim().required().messages({
    'string.base': `"variant" phải là một chuỗi ký tự`,
    'string.empty': `"variant" không được để trống`,
    'any.required': `"variant" là trường bắt buộc`,
  }),
  value: Joi.string().trim().required().messages({
    'string.base': `"value" phải là một chuỗi ký tự`,
    'string.empty': `"value" không được để trống`,
    'any.required': `"value" là trường bắt buộc`,
  }),
});

const productItemSchema = Joi.object({
  productId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': `"productId" phải là một ObjectId hợp lệ`,
      'any.required': `"productId" là trường bắt buộc`,
    }),
  variants: Joi.array().items(variantSchema).required().messages({
    'array.base': `"variants" phải là một mảng`,
    'any.required': `"variants" là trường bắt buộc`,
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': `"stock" phải là một số nguyên`,
    'number.min': `"stock" phải lớn hơn hoặc bằng 0`,
    'any.required': `"stock" là trường bắt buộc`,
  }),
  price: Joi.number().greater(0).required().messages({
    'number.base': `"price" phải là một số`,
    'number.greater': `"price" phải lớn hơn 0`,
    'any.required': `"price" là trường bắt buộc`,
  }),
  image: Joi.string().allow('').optional().messages({
    'string.base': `"image" phải là một chuỗi ký tự`,
  }),
});

export default productItemSchema;

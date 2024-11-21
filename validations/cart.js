import Joi from 'joi';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createCartSchema = Joi.object({
  UserID: Joi.string().pattern(objectIdPattern).required().messages({
    'any.required': 'UserID là bắt buộc',
    'string.empty': 'UserID không được để trống',
    'string.pattern.base': 'UserID phải là một ObjectId hợp lệ',
  }),
  carts: Joi.array()
    .items(
      Joi.object({
        productID: Joi.string().pattern(objectIdPattern).required().messages({
          'any.required': 'ProductID là bắt buộc',
          'string.empty': 'ProductID không được để trống',
          'string.pattern.base': 'ProductID phải là một ObjectId hợp lệ',
        }),
        productItemID: Joi.string()
          .pattern(objectIdPattern)
          .required()
          .messages({
            'any.required': 'ProductItemID là bắt buộc',
            'string.empty': 'ProductItemID không được để trống',
            'string.pattern.base': 'ProductItemID phải là một ObjectId hợp lệ',
          }),
        quantity: Joi.number().integer().min(1).required().messages({
          'any.required': 'Số lượng là bắt buộc',
          'number.base': 'Số lượng phải là một số',
          'number.integer': 'Số lượng phải là một số nguyên',
          'number.min': 'Số lượng phải ít nhất là 1',
        }),
        price: Joi.number().greater(0).required().messages({
          'any.required': 'Giá là bắt buộc',
          'number.base': 'Giá phải là một số',
          'number.greater': 'Giá phải lớn hơn 0',
        }),
        dateAdded: Joi.date().optional().messages({
          'date.base': 'Ngày thêm phải là một ngày hợp lệ',
        }),
      }),
    )
    .required()
    .messages({
      'array.base': 'Danh sách sản phẩm phải là một mảng',
      'any.required': 'Danh sách sản phẩm là bắt buộc',
    }),
}).options({
  abortEarly: false,
});

export const updateCartSchema = Joi.object({
  UserID: Joi.string().pattern(objectIdPattern).optional().messages({
    'string.base': 'UserID phải là một chuỗi',
    'string.pattern.base': 'UserID phải là một ObjectId hợp lệ',
  }),
  carts: Joi.array()
    .items(
      Joi.object({
        productID: Joi.string().pattern(objectIdPattern).optional().messages({
          'string.empty': 'ProductID không được để trống',
          'string.pattern.base': 'ProductID phải là một ObjectId hợp lệ',
        }),
        productItemID: Joi.string()
          .pattern(objectIdPattern)
          .optional()
          .messages({
            'string.empty': 'ProductItemID không được để trống',
            'string.pattern.base': 'ProductItemID phải là một ObjectId hợp lệ',
          }),
        quantity: Joi.number().integer().min(1).optional().messages({
          'number.base': 'Số lượng phải là một số',
          'number.integer': 'Số lượng phải là một số nguyên',
          'number.min': 'Số lượng phải ít nhất là 1',
        }),
        price: Joi.number().greater(0).optional().messages({
          'number.base': 'Giá phải là một số',
          'number.greater': 'Giá phải lớn hơn 0',
        }),
        dateAdded: Joi.date().optional().messages({
          'date.base': 'Ngày thêm phải là một ngày hợp lệ',
        }),
      }),
    )
    .optional()
    .messages({
      'array.base': 'Danh sách sản phẩm phải là một mảng',
    }),
}).options({
  abortEarly: false,
});

import Joi from 'joi';

// Schema cho việc tạo mới sản phẩm
const createValidate = Joi.object({
    categoryName: Joi.string().required().messages({
        'any.required': 'Category name is required',
        'string.empty': 'Category name cannot be empty'
    }),
    description: Joi.string().min(0).optional().messages({
        'string.base': 'Description must be a string'
    }),
    dateCreated: Joi.number().min(0).optional().messages({
        'number.base': 'Date created must be a number',
        'number.min': 'Date created must be at least 0'
    }),
    dateModified: Joi.number().min(0).optional().messages({
        'number.base': 'Date modified must be a number',
        'number.min': 'Date modified must be at least 0'
    })
}).options({
    abortEarly: false
});

// Schema cho việc cập nhật sản phẩm
const updateValidate = Joi.object({
    categoryName: Joi.string().required().messages({
        'any.required': 'Category name is required',
        'string.empty': 'Category name cannot be empty'
    }),
    description: Joi.string().allow('').optional().messages({
        'string.base': 'Description must be a string'
    }),
    dateModified: Joi.number().messages({
        'number.base': 'Date modified must be a number'
    }),
    dateCreated: Joi.number().messages({
        'number.base': 'Date created must be a number'
    })
}).options({
    abortEarly: false
});

export { createValidate, updateValidate };

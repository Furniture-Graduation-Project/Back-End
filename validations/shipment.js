import Joi from 'joi';

export const shipmentSchema = Joi.object({
  deliveryPerson: Joi.string().required().messages({
    'any.required': 'Người giao hàng là bắt buộc',
    'string.empty': 'Người giao hàng không được để trống',
  }),
  items: Joi.array().items(
    Joi.object({
      title: Joi.string().required().messages({
        'any.required': 'Tiêu đề là bắt buộc',
        'string.empty': 'Tiêu đề không được để trống',
      }),
      description: Joi.string().required().messages({
        'any.required': 'Mô tả là bắt buộc',
        'string.empty': 'Mô tả không được để trống',
      }),
      shipmentDate: Joi.date().required().messages({
        'any.required': 'Ngày giao hàng là bắt buộc',
        'date.base': 'Ngày giao hàng phải là một ngày hợp lệ',
      }),
    }),
  ),
});

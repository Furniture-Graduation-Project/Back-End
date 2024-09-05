import Joi from 'joi';

export const paymentSchema = Joi.object({
  paymentMethod: Joi.string()
    .valid(
      'credit_card',
      'debit_card',
      'paypal',
      'bank_transfer',
      'cash_on_delivery',
    )
    .required()
    .messages({
      'any.required': 'Phương thức thanh toán là bắt buộc',
      'any.only':
        'Phương thức thanh toán phải là một trong các giá trị [credit_card, debit_card, paypal, bank_transfer, cash_on_delivery]',
      'string.empty': 'Phương thức thanh toán không được để trống',
    }),
  amount: Joi.number().required().messages({
    'any.required': 'Số tiền là bắt buộc',
    'number.base': 'Số tiền phải là một con số',
  }),
  paymentDate: Joi.date().optional().default(Date.now).messages({
    'date.base': 'Ngày thanh toán phải là một ngày hợp lệ',
  }),
  paymentStatus: Joi.string()
    .valid('paid', 'unpaid')
    .optional()
    .default('unpaid')
    .messages({
      'any.only': 'Trạng thái thanh toán phải là "paid" hoặc "unpaid"',
    }),
});

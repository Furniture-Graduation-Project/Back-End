import Joi from "joi";

export const paymentSchema = Joi.object({
  paymentMethod: Joi.string()
    .valid(
      "credit_card",
      "debit_card",
      "paypal",
      "bank_transfer",
      "cash_on_delivery"
    )
    .required()
    .messages({
      "any.required": "Payment Method is required",
      "any.only":
        "Payment Method must be one of [credit_card, debit_card, paypal, bank_transfer, cash_on_delivery]",
      "string.empty": "Payment Method cannot be empty",
    }),
  amount: Joi.number().required().messages({
    "any.required": "Amount is required",
    "number.base": "Amount must be a number",
  }),
  paymentDate: Joi.date().optional().default(Date.now).messages({
    "date.base": "Payment Date must be a valid date",
  }),
  paymentStatus: Joi.string()
    .valid("paid", "unpaid")
    .optional()
    .default("unpaid")
    .messages({
      "any.only": 'Payment Status must be either "paid" or "unpaid"',
    }),
});

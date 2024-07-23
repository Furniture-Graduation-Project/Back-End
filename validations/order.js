import Joi from "joi";

const OrderValidation = {
  requiredSchema: Joi.object({
    userId: Joi.string().required(),
    orderName: Joi.string().required(),
    orderPhone: Joi.string()
      .required()
      .pattern(/^[0-9]{10,15}$/),
    orderAddress: Joi.string().required(),
    totalPrice: Joi.number().required(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          productOptionId: Joi.string().required(),
          unitPrice: Joi.number().required(),
          quantity: Joi.number().required(),
        })
      )
      .required(),
    payment: Joi.string(),
    shipments: Joi.array().items(Joi.string()),
    status: Joi.string()
      .valid("pending", "confirmed", "shipped", "delivered")
      .default("pending"),
    deliveryPerson: Joi.string(),
  }),
  optionalSchema: Joi.object({
    userId: Joi.string().optional(),
    orderName: Joi.string().optional(),
    orderPhone: Joi.string().optional(),
    orderAddress: Joi.string().optional(),
    totalPrice: Joi.number().optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().optional(),
          productOptionId: Joi.string().optional(),
          unitPrice: Joi.number().optional(),
          quantity: Joi.number().optional(),
        })
      )
      .optional(),
    payment: Joi.string().optional(),
    shipments: Joi.array().items(Joi.string()).optional(),
    status: Joi.string()
      .valid("pending", "confirmed", "shipped", "delivered")
      .optional(),
    deliveryPerson: Joi.string().optional(),
  }),
};

export default OrderValidation;

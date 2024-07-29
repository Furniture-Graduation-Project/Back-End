import Joi from "joi";
import { orderItemSchema } from "./orderItem.js";
import { paymentSchema } from "./payment.js";
import { shipmentSchema } from "./shipment.js";

const OrderValidation = {
  requiredSchema: Joi.object({
    userId: Joi.string().required(),
    orderName: Joi.string().required(),
    orderPhone: Joi.string()
      .required()
      .pattern(/^[0-9]{10,15}$/),
    orderAddress: Joi.string().required(),
    totalPrice: Joi.number().required(),
    payment: paymentSchema.required(),
    items: Joi.array().min(1).items(orderItemSchema).required(),
    status: Joi.string().valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
      "refunded"
    ),
  }),
  optionalSchema: Joi.object({
    userId: Joi.string().optional(),
    orderName: Joi.string().optional(),
    orderPhone: Joi.string().optional(),
    orderAddress: Joi.string().optional(),
    totalPrice: Joi.number().optional(),
    items: Joi.array().min(1).items(orderItemSchema).optional(),
    payment: paymentSchema.optional(),
    shipments: shipmentSchema.optional(),
    status: Joi.string()
      .valid(
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "refunded"
      )
      .optional(),
  }),
};

export default OrderValidation;

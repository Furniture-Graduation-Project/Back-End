import Joi from "joi";

export const shipmentSchema = Joi.object({
  deliveryPerson: Joi.string().required().messages({
    "any.required": "Delivery person is required",
    "string.empty": "Delivery person cannot be empty",
  }),
  items: Joi.array().items(
    Joi.object({
      title: Joi.string().required().messages({
        "any.required": "Title is required",
        "string.empty": "Title cannot be empty",
      }),
      description: Joi.string().required().messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be empty",
      }),
      shipmentDate: Joi.date().required().messages({
        "any.required": "Shipment date is required",
        "date.base": "Shipment date must be a valid date",
      }),
    })
  ),
});

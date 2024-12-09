import Joi from "joi";

export const locationSchema = Joi.object({
  addressName: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  district: Joi.string().required(),
  ward: Joi.string().required(),
  street: Joi.string().required(),
  default: Joi.boolean(),
});

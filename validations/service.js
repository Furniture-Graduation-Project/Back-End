import Joi from "joi";

export const serviceSchema = Joi.object({
    name: Joi.string().required(),
    vendor: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().precision(2).required(),
});

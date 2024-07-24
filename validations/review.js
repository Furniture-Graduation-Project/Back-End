import Joi from "joi";

const crudValidate = Joi.object({
  rating: Joi.string().required().messages({
    "any.required": "Rating không được để trống",
    "string.empty": "Rating không được để trống",
  }),
  commenttext: Joi.string().required().messages({
    "any.required": "Comment text không được để trống",
    "string.empty": "Comment text không được để trống",
  }),
  commentdate: Joi.string().required().messages({
    "any.required": "Comment date không được để trống",
    "string.empty": "Comment date không được để trống",
  }),
});

export { crudValidate };

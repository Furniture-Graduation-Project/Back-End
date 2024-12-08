import Joi from "joi";

export const wishlistSchema = Joi.object({
  productId: Joi.string().required().messages({
    "any.required": "Mã sản phẩm là bắt buộc",
    "string.empty": "Mã sản phẩm không được để trống",
  }),
});

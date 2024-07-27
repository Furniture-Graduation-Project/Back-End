import Joi from "joi";

const promotionSchema = Joi.object({
  description: Joi.string().required().messages({
    "any.required": "Mô tả là bắt buộc",
    "string.empty": "Mô tả không được để trống",
  }),
  type: Joi.string().valid("Percent", "Fixed").required().messages({
    "any.required": "Loại promotion là bắt buộc",
    "any.only": "Loại promotion không hợp lệ",
  }),
  value: Joi.number().required().messages({
    "any.required": "Giá trị là bắt buộc",
    "number.base": "Giá trị phải là số",
  }),
  startDate: Joi.date().required().messages({
    "any.required": "Ngày bắt đầu là bắt buộc",
    "date.base": "Ngày bắt đầu không hợp lệ",
  }),
  endDate: Joi.date().required().messages({
    "any.required": "Ngày kết thúc là bắt buộc",
    "date.base": "Ngày kết thúc không hợp lệ",
  }),
  productID: Joi.string().optional().messages({
    "string.base": "ID sản phẩm phải là chuỗi",
  }),
  categoryID: Joi.string().optional().messages({
    "string.base": "ID danh mục phải là chuỗi",
  }),
});

export const validatePromotion = (req, res, next) => {
  const { error } = promotionSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorMessages });
  }
  next();
};

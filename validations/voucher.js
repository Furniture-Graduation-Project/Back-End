import Joi from "joi";
import { StatusCodes } from "http-status-codes";

const voucherSchema = Joi.object({
  code: Joi.string().required().messages({
    "any.required": "Mã voucher là bắt buộc",
    "string.empty": "Mã voucher không được để trống",
  }),
  description: Joi.string().required().messages({
    "any.required": "Mô tả là bắt buộc",
    "string.empty": "Mô tả không được để trống",
  }),
  type: Joi.string().valid("Percent", "Fixed").required().messages({
    "any.required": "Loại voucher là bắt buộc",
    "any.only": "Loại voucher không hợp lệ",
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
  usageLimit: Joi.number().required().messages({
    "any.required": "Giới hạn sử dụng là bắt buộc",
    "number.base": "Giới hạn sử dụng phải là số",
  }),
  status: Joi.string().valid("active", "inactive").required().messages({
    "any.required": "Trạng thái là bắt buộc",
    "any.only": "Trạng thái không hợp lệ",
  }),
  products: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Danh sách sản phẩm phải là một mảng",
  }),
  categories: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Danh sách danh mục phải là một mảng",
  }),
  orders: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Danh sách đơn hàng phải là một mảng",
  }),
});

export const validateVoucher = (req, res, next) => {
  const { error } = voucherSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorMessages });
  }
  next();
};

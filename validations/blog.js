import Joi from "joi";

export const blogSchema = Joi.object({
  authorId: Joi.string().required().messages({
    "any.required": "Tác giả không được để trống",
    "string.empty": "Tác giả không được để trống",
  }),
  title: Joi.string().trim().required().messages({
    "any.required": "Tiêu đề không được để trống",
    "string.empty": "Tiêu đề không được để trống",
  }),
  content: Joi.string().trim().required().messages({
    "any.required": "Nội dung không được để trống",
    "string.empty": "Nội dung không được để trống",
  }),
  tags: Joi.array().items(Joi.string().trim()).optional().messages({
    "array.base": "Thẻ phải là một mảng các chuỗi",
    "string.base": "Mỗi thẻ phải là một chuỗi",
  }),
  image: Joi.string().trim().uri().optional().messages({
    "string.uri": "URL hình ảnh không hợp lệ",
  }),
  date: Joi.date().iso().required().messages({
    "any.required": "Ngày viết bài không được để trống",
    "date.base": "Ngày viết bài phải là một ngày hợp lệ",
  }),
});

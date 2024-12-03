import Joi from 'joi';
import { orderItemSchema } from './orderItem.js';
import { paymentSchema } from './payment.js';
import { shipmentSchema } from './shipment.js';

export const createOrderSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'Mã người dùng là bắt buộc',
    'string.empty': 'Mã người dùng không được để trống',
  }),
  orderName: Joi.string().required().messages({
    'any.required': 'Tên đơn hàng là bắt buộc',
    'string.empty': 'Tên đơn hàng không được để trống',
  }),
  orderPhone: Joi.string()
    .required()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      'any.required': 'Số điện thoại là bắt buộc',
      'string.empty': 'Số điện thoại không được để trống',
      'string.pattern.base': 'Số điện thoại phải có độ dài từ 10 đến 15 chữ số',
    }),
  orderAddress: Joi.string().required().messages({
    'any.required': 'Địa chỉ đơn hàng là bắt buộc',
    'string.empty': 'Địa chỉ đơn hàng không được để trống',
  }),
  totalPrice: Joi.number().required().messages({
    'any.required': 'Tổng giá là bắt buộc',
    'number.base': 'Tổng giá phải là số',
  }),
  payment: paymentSchema.required().messages({
    'any.required': 'Thông tin thanh toán là bắt buộc',
  }),
  items: Joi.array().min(1).items(orderItemSchema).required().messages({
    'any.required': 'Danh sách sản phẩm là bắt buộc',
    'array.min': 'Phải có ít nhất 1 sản phẩm trong đơn hàng',
  }),
  status: Joi.string()
    .valid(
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'received',
      'cancelled',
      'returned',
      'refunded',
      'unpaid',
    )
    .messages({
      'any.only': 'Trạng thái đơn hàng không hợp lệ',
    }),
  statusHistory: Joi.array()
    .items(
      Joi.object({
        status: Joi.string()
          .valid(
            'pending',
            'unpaid',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'received',
            'cancelled',
            'returned',
            'refunded',
          )
          .required()
          .messages({
            'any.required': 'Trạng thái là bắt buộc',
            'any.only': 'Trạng thái không hợp lệ',
          }),
        date: Joi.date()
          .iso()
          .default(() => new Date())
          .messages({
            'date.base': 'Ngày phải là một giá trị hợp lệ',
            'date.iso': 'Ngày phải tuân theo định dạng ISO 8601',
          }),
      }),
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'Phải có ít nhất một trạng thái trong lịch sử trạng thái',
    }),
});

export const updateOrderSchema = Joi.object({
  userId: Joi.string().optional().messages({
    'string.empty': 'Mã người dùng không được để trống',
  }),
  orderName: Joi.string().optional().messages({
    'string.empty': 'Tên đơn hàng không được để trống',
  }),
  orderPhone: Joi.string().optional().messages({
    'string.pattern.base': 'Số điện thoại phải có độ dài từ 10 đến 15 chữ số',
  }),
  orderAddress: Joi.string().optional().messages({
    'string.empty': 'Địa chỉ đơn hàng không được để trống',
  }),
  totalPrice: Joi.number().optional().messages({
    'number.base': 'Tổng giá phải là số',
  }),
  items: Joi.array().min(1).items(orderItemSchema).optional().messages({
    'array.min': 'Phải có ít nhất 1 sản phẩm trong đơn hàng',
  }),
  payment: paymentSchema.optional(),
  shipments: shipmentSchema.optional(),
  status: Joi.string()
    .valid(
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'received',
      'cancelled',
      'returned',
      'refunded',
      'unpaid',
    )
    .optional()
    .messages({
      'any.only': 'Trạng thái đơn hàng không hợp lệ',
    }),
  statusHistory: Joi.array()
    .items(
      Joi.object({
        status: Joi.string()
          .valid(
            'pending',
            'unpaid',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'received',
            'cancelled',
            'returned',
            'refunded',
          )
          .required()
          .messages({
            'any.required': 'Trạng thái là bắt buộc',
            'any.only': 'Trạng thái không hợp lệ',
          }),
        date: Joi.date()
          .iso()
          .default(() => new Date())
          .messages({
            'date.base': 'Ngày phải là một giá trị hợp lệ',
            'date.iso': 'Ngày phải tuân theo định dạng ISO 8601',
          }),
      }),
    )
    .min(1)
    .messages({
      'array.min': 'Phải có ít nhất một trạng thái trong lịch sử trạng thái',
    }),
  deleted: Joi.boolean().optional(),
});

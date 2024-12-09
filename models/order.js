import mongoose from "mongoose";
import { paymentSchema } from "./payment.js";
import { shipmentSchema } from "./shipment.js";
import { orderItemSchema } from "./orderItem.js";

const orderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderName: {
      type: String,
      required: true,
    },
    orderPhone: {
      type: String,
      required: true,
    },
    orderAddress: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    items: [orderItemSchema],
    payment: paymentSchema,
    shipments: shipmentSchema,
    status: {
      type: String,
      enum: [
        "pending",
        "unpaid",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "received",
        "cancelled",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "pending",
            "unpaid",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "received",
            "cancelled",
          ],
        },
        date: { type: Date, default: Date.now },
      },
    ],
    returnInfo: {
      status: {
        type: String,
        enum: [
          "pending",
          "processing",
          "resolved",
          "returned",
          "refunded",
          "finished",
        ],
        default: "pending",
      },
      reason: { type: String },
      response: { type: String },
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          productOptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductItem",
          },
          quantity: { type: Number, required: true },
          unitPrice: {
            type: Number,
            required: true,
          },
          status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
          },
        },
      ],
      dateRequested: { type: Date, default: Date.now },
      dateResolved: { type: Date },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;

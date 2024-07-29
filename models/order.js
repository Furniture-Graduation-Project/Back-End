import mongoose from "mongoose";
import { paymentSchema } from "./payment.js";
import { shipmentSchema } from "./shipment.js";
import { orderItemSchema } from "./orderItem.js";

const orderSchema = new mongoose.Schema({
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
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
      "refunded",
    ],
    default: "pending",
  },
});

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;

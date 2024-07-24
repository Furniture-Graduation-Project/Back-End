import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productOptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductOption",
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

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
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  shipments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
    },
  ],
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered"],
    default: "pending",
  },
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
});

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;

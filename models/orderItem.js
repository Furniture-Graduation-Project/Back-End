import mongoose from "mongoose";

export const orderItemSchema = new mongoose.Schema({
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

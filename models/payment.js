import mongoose from "mongoose";
export const paymentSchema = new mongoose.Schema({
  paymentMethod: {
    type: String,
    enum: [
      "credit_card",
      "debit_card",
      "paypal",
      "bank_transfer",
      "cash_on_delivery",
    ],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid",
  },
});

import mongoose from "mongoose";
export const paymentSchema = new mongoose.Schema({
  paymentMethod: {
    type: String,
    enum: ["credit_card", "cash_on_delivery"],
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

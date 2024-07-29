import mongoose from "mongoose";

export const shipmentSchema = new mongoose.Schema({
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  item: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      shipmentDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

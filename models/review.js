import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewText: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    reviewDate: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);
const Review = mongoose.model("review", ReviewSchema);
export default Review;

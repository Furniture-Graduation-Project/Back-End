import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    commenttext: {
      type: String,
    },
    commentdate: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);
const Review = mongoose.model("review", ReviewSchema);
export default Review;

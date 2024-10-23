import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
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
    reviewDate: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);
const Comment = mongoose.model("commemt", CommentSchema);
export default Comment;

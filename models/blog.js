import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String], // Chứa các tag gắn với blog
      default: [],
    },
    image: {
      type: String, // URL hình ảnh đại diện cho blog
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

const BlogModel = mongoose.model("Blog", BlogSchema);
export default BlogModel;

import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);
export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, versionKey: false }
);

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;

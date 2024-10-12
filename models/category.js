import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
    unique: true,
  },
  categoryName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  role: {
    type: Number,
    required: true,
    default: 0,
  },
  DateCreated: {
    type: Date,
    default: Date.now,
  },
  DateModified: {
    type: Date,
    default: Date.now,
  },
});

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
    },
    materialDetail: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Đang tạo", "Còn hàng", "Khóa"],
      default: "Đang tạo",
    },
  },
  { timestamps: true, versionKey: false }
);

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;

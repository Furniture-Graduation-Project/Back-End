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
    price: {
      type: Number,
      required: true,
    },
    SKU: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    material: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "out of stock", "discontinued"],
      default: "available",
    },
  },
  { timestamps: true, versionKey: false }
);

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;

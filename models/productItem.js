import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  variant: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const productItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variants: {
    type: [variantSchema],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  outStock: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  SKU: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "deleted"],
    default: "active",
    required: true,
  },
});

const ProductItemModel = mongoose.model("ProductItem", productItemSchema);

export default ProductItemModel;

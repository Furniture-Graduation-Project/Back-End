import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  ProductID: { type: String, required: true },
  ProductOption: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Price: { type: Number, required: true },
  DateAdded: { type: Date, default: Date.now },
});

const cartSchema = new mongoose.Schema({
  UserID: { type: String, required: true },
  items: [cartItemSchema],
  DateAdded: { type: Date, default: Date.now },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

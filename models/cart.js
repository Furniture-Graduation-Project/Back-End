import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productItemID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductItem',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    carts: [cartItemSchema],
  },
  { timestamps: true, versionKey: false },
);

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;

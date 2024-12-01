import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productOptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductItem',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  }
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

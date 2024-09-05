import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema(
  {
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const WishlistModel = mongoose.model('wishlist', WishlistSchema);
export default WishlistModel;

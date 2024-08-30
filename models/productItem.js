import mongoose from 'mongoose';

const productItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  size: {
    type: String,
    default: '',
    trim: true,
  },
  color: {
    type: String,
    enum: [
      'Red',
      'Blue',
      'Green',
      'Black',
      'White',
      'Yellow',
      'Beige',
      'Cream',
      'Brown',
      'Gray',
      'Navy',
      'Olive',
      'Taupe',
      'Teal',
    ],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
});

const ProductItemModel = mongoose.model('ProductItem', productItemSchema);
export default ProductItemModel;

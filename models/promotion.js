import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    type: { type: String, enum: ['Percent', 'Fixed'], required: true },
    value: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
  },
);

const PromotionModel = mongoose.model('Promotion', promotionSchema);

export default PromotionModel;

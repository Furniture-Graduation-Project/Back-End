import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Percent', 'Fixed'], required: true },
    value: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Thêm trường orders
  },
  {
    timestamps: true,
  },
);

const VoucherModel = mongoose.model('Voucher', voucherSchema);

export default VoucherModel;

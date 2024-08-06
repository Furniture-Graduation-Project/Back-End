import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ProductID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    Quantity: {
        type: Number,
        required: true,
        min: 1
    },
    Price: {
        type: Number,
        required: true
    },
    DateAdded: {
        type: Date,
        default: Date.now
    }
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;

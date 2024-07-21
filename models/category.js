import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    DateCreated : {
        type: Date,
        default: Date.now
    },
    DateModified : {
        type: Date,
        default: Date.now
    },
})

const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel
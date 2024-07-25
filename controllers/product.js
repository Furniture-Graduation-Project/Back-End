import ProductModel from "../models/product.js"
import { createValidate, updateValidate } from "../validations/product.js";

const ProductController = {
    async getAllProductModel(req , res) {
        try {
            const product = await ProductModel.find();
            res.status(StatusCodes.OK).json({
                message: "Hiển thị thành công",
                data: product
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    },
    async detailProductModel(req, res) {
        try {
            const product = await ProductModel.findById(req.params.id);
            res.status(StatusCodes.OK).json({
                message: "Hiển thị thành công",
                data: product
            });
            if (!product) {
                return res.status(getStatusCode('Internal Server Error')).json({
                    message: "Not Found",
                })
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    },
    async createProductModel(req, res) {
        try {
            const productData = { ...req.body };
            const { error } = createValidate.validate(req.body);
            if (error) {
                const errors = error.details.map((err) => err.message);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: errors,
                })
            }

            const product = await ProductModel.create(productData);
            res.status(StatusCodes.OK).json({
                message: "Thêm sản phẩm thành công",
                data: product,
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    },
    async updateProductModel(req, res) {
        try {
            const productId = req.params.id;
            const productData = req.body;
            const { error } = updateValidate.validate(req.body);
            if (error) {
                const errors = error.details.map((err) => err.message);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: errors,
                })
            }
            const updateProduct = await ProductModel.findByIdAndUpdate(
                productId,
                productData,
                { new: true }
            )
            res.status(StatusCodes.OK).json({
                message: "Cập nhật sản phẩm thành công",
                data: updateProduct,
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    },
    async deleteProduct(req, res) {
        try {
            const product = await ProductModel.findByIdAndDelete(req.params.id);
            if (!product) {
                return res.status(getStatusCode('Internal Server Error')).json({
                    message: "Not Found",
                })
            }
            res.status(StatusCodes.OK).json({
                message: "Xóa thành công",
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
}

export default ProductController;
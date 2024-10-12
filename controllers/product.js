import { StatusCodes } from "http-status-codes";
import ProductModel from "../models/product.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.js";

const ProductController = {
  async getAllProduct(req, res) {
    try {
      const products = await ProductModel.find();
      res.status(StatusCodes.OK).json({
        message: "Hiển thị tất cả sản phẩm thành công",
        data: products,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async getLimitedProduct(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = parseInt(req.query.skip, 10) || 0;
      const products = await ProductModel.find().limit(limit).skip(skip);
      const totalProducts = await ProductModel.countDocuments();
      res.status(StatusCodes.OK).json({
        message: "Hiển thị thành công",
        data: products,
        total: totalProducts,
        limit,
        skip,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async detailProduct(req, res) {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy sản phẩm" });
    }
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Sản phẩm không tồn tại",
        });
      }
      res.status(StatusCodes.OK).json({
        message: "Hiển thị thành công",
        data: product,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async createProduct(req, res) {
    try {
      const { value, error } = createProductSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }

      const product = await ProductModel.create(value);
      res.status(StatusCodes.OK).json({
        message: "Thêm sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async updateProduct(req, res) {
    const productId = req.params.id;
    if (!productId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy sản phẩm" });
    }
    try {
      const { value, error } = updateProductSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }

      const updateProduct = await ProductModel.findByIdAndUpdate(
        productId,
        value,
        { new: true }
      );

      if (!updateProduct) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Sản phẩm không tồn tại",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "Cập nhật sản phẩm thành công",
        data: updateProduct,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },

  async deleteProduct(req, res) {
    const productId = req.params.id;
    if (!productId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy sản phẩm" });
    }
    try {
      const product = await ProductModel.findByIdAndDelete(productId);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Sản phẩm không tồn tại",
        });
      }
      res.status(StatusCodes.OK).json({
        message: "Xóa sản phẩm thành công",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
};

export default ProductController;

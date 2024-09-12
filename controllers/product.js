import { StatusCodes } from 'http-status-codes';
import ProductModel from '../models/product.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validations/product.js';

const ProductController = {
  async getAllProductModel(req, res) {
    try {
      const product = await ProductModel.find();
      res.status(StatusCodes.OK).json({
        message: 'Hiển thị thành công',
        data: product,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
  async detailProductModel(req, res) {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy sản phẩm' });
    }
    try {
      const product = await ProductModel.findById(id);
      res.status(StatusCodes.OK).json({
        message: 'Hiển thị thành công',
        data: product,
      });
      if (!product) {
        return res.status(getStatusCode('Internal Server Error')).json({
          message: 'Not Found',
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
  async createProductModel(req, res) {
    try {
      const { value, error } = createProductSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: errors,
        });
      }

      const product = await ProductModel.create(value);
      res.status(StatusCodes.OK).json({
        message: 'Thêm sản phẩm thành công',
        data: product,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
  async updateProductModel(req, res) {
    try {
      const productId = req.params.id;
      if (!productId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy sản phẩm' });
      }
      const { value, error } = updateProductSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: errors,
        });
      }
      const updateProduct = await ProductModel.findByIdAndUpdate(
        productId,
        value,
        { new: true },
      );
      res.status(StatusCodes.OK).json({
        message: 'Cập nhật sản phẩm thành công',
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
        .json({ message: 'Không tìm thấy sản phẩm' });
    }
    try {
      const product = await ProductModel.findByIdAndDelete(productId);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Không tìm thấy sản phẩm',
        });
      }
      res.status(StatusCodes.OK).json({
        message: 'Xóa thành công',
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
};

export default ProductController;

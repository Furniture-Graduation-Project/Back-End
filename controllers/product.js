import { StatusCodes } from "http-status-codes";
import ProductModel from "../models/product.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.js";
import ProductItemModel from "../models/productItem.js";

export const ProductController = {
  getAll: async (req, res) => {
    try {
      const products = await ProductModel.find()
        .populate("category", "categoryName")
        .populate("material", "materialName");

      res.status(StatusCodes.OK).json({
        data: products,
        message: "Hiển thị tất cả sản phẩm thành công",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi lấy thông tin sản phẩm.",
        error: error.message,
      });
    }
  },

  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const products = await ProductModel.find()
        .populate("category", "categoryName")
        .populate("material", "materialName")
        .skip(skip)
        .limit(limit);

      const productsWithPrices = await Promise.all(
        products.map(async (product) => {
          const prices = await ProductItemModel.find({
            productId: product._id,
          }).select('price');
          const priceList = prices.map((item) => item.price);
          return {
            ...product.toObject(),
            prices: priceList,
          };
        }),
      );

      const totalData = await ProductModel.countDocuments();
      const totalPage = limit ? Math.ceil(totalData / limit) : 1;

      res.status(StatusCodes.OK).json({
        data: productsWithPrices,
        totalPage,
        totalData,
        message: "Lấy sản phẩm thành công.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi lấy thông tin sản phẩm.",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Không tìm thấy sản phẩm" });
      }
      const product = await ProductModel.findById(id);
      if (!product) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Sản phẩm không tồn tại." });
      }
      res.status(StatusCodes.OK).json({
        data: product,
        message: "Lấy sản phẩm thành công.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi lấy thông tin sản phẩm.",
        error: error.message,
      });
    }
  },

  createProduct: async (req, res) => {
    try {
      const { value, error } = createProductSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }
      const newProduct = new ProductModel(value);
      await newProduct.save();
      res.status(StatusCodes.CREATED).json({
        data: newProduct,
        message: "Tạo sản phẩm thành công.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi tạo sản phẩm.",
        error: error.message,
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { value, error } = updateProductSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }
      const updatedProduct = await ProductModel.findByIdAndUpdate(id, value, {
        new: true,
        runValidators: true,
      });

      if (!updatedProduct) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Sản phẩm không tồn tại." });
      }

      res.status(StatusCodes.OK).json({
        data: updatedProduct,
        message: "Cập nhật sản phẩm thành công.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi cập nhật sản phẩm.",
        error: error.message,
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Không tìm thấy sản phẩm" });
      }
      const deletedProduct = await ProductModel.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Sản phẩm không tồn tại." });
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "Sản phẩm đã được xóa thành công." });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi xóa sản phẩm.",
        error: error.message,
      });
    }
  },
  getByName: async (req, res) => {
    try {
      const { name } = req.query;
      if (!name) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Tên sản phẩm không được bỏ trống." });
      }
      const products = await ProductModel.find({
        name: { $regex: name, $options: "i" },
      });
      if (products.length === 0) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Không tìm thấy sản phẩm." });
      }
      res.status(StatusCodes.OK).json({
        data: products,
        message: "Tìm kiếm sản phẩm thành công.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi tìm kiếm sản phẩm.",
        error: error.message,
      });
    }
  },

  checkProduct: async (items) => {
    try {
      if (!items || !Array.isArray(items)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Danh sách sản phẩm không hợp lệ.",
        });
      }
      const productDetails = await Promise.all(
        items.map(async (item) => {
          const product = await ProductModel.findOne({
            _id: item.productId,
            status: "available",
          });

          const productItem = await ProductItemModel.findById(
            item.productOptionId
          );
          return {
            productId: product ? product._id : "",
            productOptionId: productItem ? productItem._id : "",
            quantity: productItem
              ? productItem.stock - productItem.outStock
              : 0,
            unitPrice: productItem ? productItem.price : 0,
          };
        })
      );
      return productDetails;
    } catch (error) {
      return error;
    }
  },
};

import { StatusCodes } from 'http-status-codes';
import ProductItemModel from '../models/productItem.js';
import { productItemSchema } from '../validations/productItem.js';

const ProductItemController = {
  create: async (req, res) => {
    try {
      const { productId, variants, stock, price, image } = req.body;

      const { value, error } = productItemSchema.validate(
        {
          productId,
          variants,
          stock,
          price,
          image,
        },
        { abortEarly: false, stripUnknown: true },
      );

      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }

      const newProductItem = new ProductItemModel({
        value,
      });
      await newProductItem.save();

      return res.status(StatusCodes.CREATED).json(newProductItem);
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Lỗi server', error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const productItems = await ProductItemModel.find();
      return res.status(StatusCodes.OK).json(productItems);
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Lỗi server', error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy đánh giá' });
      }
      const productItem = await ProductItemModel.findById(id);

      if (!productItem) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Không tìm thấy sản phẩm biến thể' });
      }

      return res.status(StatusCodes.OK).json(productItem);
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Lỗi server', error: err.message });
    }
  },
  getByProductId: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy sản phẩm biến thể' });
      }
      const productItem = await ProductItemModel.find({
        productId: id,
      });

      if (!productItem) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Không tìm thấy sản phẩm' });
      }

      return res.status(StatusCodes.OK).json({
        message: 'Lấy danh sách sản phẩm biến thể thành công',
        data: productItem,
      });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Lỗi server', error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { value, error } = productItemSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: errors,
        });
      }

      const updatedProductItem = await ProductItemModel.findByIdAndUpdate(
        id,
        value,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedProductItem) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Không tìm thấy sản phẩm biến thể' });
      }

      return res.status(StatusCodes.OK).json(updatedProductItem);
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Lỗi server', error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy sản phẩm biến thể' });
      }

      const deletedProductItem = await ProductItemModel.findByIdAndDelete(id);

      if (!deletedProductItem) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Không tìm thấy sản phẩm biến thể' });
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Sản phẩm biến thể đã bị xóa' });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Lỗi server', error: err.message });
    }
  },
};

export default ProductItemController;

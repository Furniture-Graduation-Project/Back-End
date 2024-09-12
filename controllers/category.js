import CategoryModel from '../models/category.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validations/category.js';
import { StatusCodes } from 'http-status-codes';
const CategoryController = {
  async getAllCategoryModel(req, res) {
    try {
      const category = await CategoryModel.find();
      res.status(StatusCodes.OK).json({
        message: 'Hiển thị thành công',
        data: category,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
  async detailCategoryModel(req, res) {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy danh mục' });
    }
    try {
      const category = await CategoryModel.findById(id);
      res.status(StatusCodes.OK).json({
        message: 'Hiển thị thành công',
        data: category,
      });
      if (!category) {
        return res.status(getStatusCode('Internal Server Error')).json({
          message: 'Not Found',
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        'http-status-code': 400,
        message: error.message,
      });
    }
  },
  async createCategoryModel(req, res) {
    try {
      const { value, error } = createCategorySchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Lỗi: ' + errors.join(', '),
        });
      }
      const category = await CategoryModel.create(value);
      res.status(StatusCodes.OK).json({
        'http-status-code': 200,
        message: 'Thêm thành công',
        data: category,
      });
    } catch (error) {
      if (error.isJoi) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: errors,
        });
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
  async updateCategoryModel(req, res) {
    try {
      const categoryId = req.params.id;
      if (!categoryId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy danh mục' });
      }
      const { value, error } = updateCategorySchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          'http-status-code': 400,
          message: errors,
        });
      }
      const updateCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        value,
        { new: true },
      );
      res.status(StatusCodes.OK).json({
        message: 'Cập nhật thành công',
        data: updateCategory,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
  async deleteCategory(req, res) {
    const id = req.params.id;
    try {
      const category = await CategoryModel.findByIdAndDelete(id);
      if (!category) {
        return res.status(getStatusCode('Internal Server Error')).json({
          message: 'Not Found',
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

export default CategoryController;

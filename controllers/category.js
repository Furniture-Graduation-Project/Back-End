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
    try {
      const category = await CategoryModel.findById(req.params.id);
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
      // Validate dữ liệu từ request body
      const categoryData = { ...req.body };
      await createCategorySchema.validateAsync(categoryData, {
        abortEarly: false,
      });

      // Tạo category mới trong database
      const category = await CategoryModel.create(categoryData);
      res.status(StatusCodes.OK).json({
        'http-status-code': 200,
        message: 'Thêm thành công',
        data: category,
      });
    } catch (error) {
      // Kiểm tra lỗi validate của Joi
      if (error.isJoi) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: errors,
        });
      }

      // Xử lý các lỗi khác
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  },
  async updateCategoryModel(req, res) {
    try {
      const categoryId = req.params.id;
      const categoryData = req.body;
      const { error } = updateCategorySchema.validate(req.body);
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          'http-status-code': 400,
          message: errors,
        });
      }
      const updateCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        categoryData,
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
    try {
      const category = await CategoryModel.findByIdAndDelete(req.params.id);
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

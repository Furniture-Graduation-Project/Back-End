import { StatusCodes } from "http-status-codes";
import Category from "../models/category.js";
import Product from "../models/product.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.js";
const CategoryController = {
  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const categories = await Category.find().skip(skip).limit(limit);

      if (!categories || categories.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không có danh mục nào." });
      }

      const totalCategories = await Category.countDocuments();
      const totalPages = limit ? Math.ceil(totalCategories / limit) : 1;

      res.status(StatusCodes.OK).json({
        categories,
        page,
        totalPages,
        totalCategories,
        message: "Lấy danh sách danh mục thành công.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi lấy thông tin danh mục.",
        error: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { error } = createCategorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          errors: error.details.map((err) => err.message),
        });
      }

      const { categoryName, description } = req.body;
      const existingCategory = await Category.findOne({ categoryName });
      if (existingCategory) {
        return res.status(400).json({ message: "Tên danh mục đã tồn tại." });
      }

      const category = new Category({
        categoryName,
        description,
        role: req.body.role || 0,
      });

      await category.save();
      return res.status(StatusCodes.CREATED).json(category);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const categories = await Category.find({});
      if (categories.length === 0) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Không có danh mục nào!" });
      }
      return res.status(StatusCodes.OK).json(categories);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const products = await Product.find({ categoryId: id });
      const category = await Category.findById(id);
      if (!category) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy danh mục!" });
      }
      return res.status(StatusCodes.OK).json({
        category,
        products,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  },

  deleteCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const defaultCategory = await Category.findOne({ role: 1 });

      if (!defaultCategory) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy danh mục mặc định!" });
      }

      await Product.updateMany(
        { categoryId: id },
        { categoryId: defaultCategory.categoryId }
      );

      const deletedCategory = await Category.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy danh mục để xóa!" });
      }

      return res.status(StatusCodes.OK).json({
        message: "Xóa danh mục thành công!",
        deletedCategory,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  },

  updateCategoryById: async (req, res) => {
    try {
      const { error } = updateCategorySchema.validate(req.body);
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          details: error.details.map((err) => err.message),
        });
      }

      const { id } = req.params;
      const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedCategory) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy danh mục để cập nhật!" });
      }
      return res.status(StatusCodes.OK).json(updatedCategory);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  },
};

export default CategoryController;

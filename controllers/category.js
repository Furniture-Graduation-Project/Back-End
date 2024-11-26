import { StatusCodes } from "http-status-codes";
import Category from "../models/category.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.js";

const CategoryController = {
  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const categories = await Category.find().skip(skip).limit(limit);

      if (!categories || categories.length === 0) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Không có danh mục nào." });
      }

      const totalData = await Category.countDocuments();
      const totalPage = limit ? Math.ceil(totalData / limit) : 1;

      res.status(StatusCodes.OK).json({
        data: categories,
        totalPage,
        totalData,
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
        return res.status(StatusCodes.BAD_REQUEST).json({
          details: error.details.map((err) => err.message),
        });
      }

      const existingCategory = await Category.findOne({
        categoryName: req.body.categoryName,
      });
      if (existingCategory) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Danh mục đã tồn tại.",
        });
      }

      const newCategory = new Category(req.body);
      await newCategory.save();

      return res.status(StatusCodes.CREATED).json({
        message: "Tạo danh mục thành công.",
        data: newCategory,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi tạo danh mục.",
        error: error.message,
      });
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
      return res.status(StatusCodes.OK).json({
        data: categories,
        message: "Lấy danh sách danh mục.",
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Không tìm thấy danh mục!" });
      }
      return res.status(StatusCodes.OK).json({
        data: category,
        message: "Lấy danh mục thành công.",
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
          .status(StatusCodes.OK)
          .json({ message: "Không tìm thấy danh mục để cập nhật!" });
      }
      return res.status(StatusCodes.OK).json(updatedCategory);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  },
  deleteCategoryById: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedCategory = await Category.findByIdAndDelete(id);

      if (!deletedCategory) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Không tìm thấy danh mục để xóa!" });
      }

      const updatedCategories = await Category.find();

      return res.status(StatusCodes.OK).json({
        message: `Xóa danh mục thành công.`,
        updatedCategories,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi xóa danh mục.",
        error: error.message,
      });
    }
  },

  searchByName: async (req, res) => {
    try {
      const { categoryName } = req.query;
      if (!categoryName) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Thiếu tham số categoryName trong yêu cầu.",
        });
      }

      const categories = await Category.find({
        categoryName: { $regex: categoryName, $options: "i" },
      });

      if (categories.length === 0) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Không tìm thấy danh mục nào." });
      }

      return res.status(StatusCodes.OK).json({
        data: categories,
        message: "Tìm kiếm danh mục thành công.",
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi tìm kiếm danh mục.",
        error: error.message,
      });
    }
  },
};

export default CategoryController;

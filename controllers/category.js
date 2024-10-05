import { StatusCodes } from "http-status-codes";
import Category from "../models/category.js";
import Product from "../models/product.js";

const CategoryController = {
  create: async (req, res) => {
    try {
      // Tìm số lượng danh mục đã tồn tại
      const categoryCount = await Category.countDocuments();

      // Nếu chưa có danh mục nào, tạo danh mục đầu tiên với role = 1
      const role = categoryCount === 0 ? 1 : 0;

      const category = await Category.create({
        categoryId: new mongoose.Types.ObjectId(),
        categoryName: req.body.categoryName,
        role: role,
        description: req.body.description,
      });

      return res.status(StatusCodes.CREATED).json(category);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
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

      // Tìm danh mục với role = 1 để cập nhật cho các sản phẩm
      const defaultCategory = await Category.findOne({ role: 1 });

      if (!defaultCategory) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy danh mục mặc định!" });
      }

      // Cập nhật danh mục sản phẩm trước khi xóa danh mục
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
      return res.status(StatusCodes.OK).json(deletedCategory);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  },

  updateCategoryById: async (req, res) => {
    try {
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

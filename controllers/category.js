import CategoryModel from "../models/category.js";
import { createValidate, updateValidate } from "../validations/category.js";

const CategoryController = {
    async getAllCategoryModel(req, res) {
        try {
            const category = await CategoryModel.find();
            res.status(200).json({
                'http-status-code': 200,
                message: "Hiển thị thành công",
                data: category
            })
        } catch (error) {
            res.status(400).json({
                'http-status-code': 400,
                message: error.message
            })
        }
    },
    async detailCategoryModel(req, res) {
        try {
            const category = await CategoryModel.findById(req.params.id);
            res.status(200).json({
                'http-status-code': 200,
                message: "Hiển thị thành công",
                data: category
            });
            if (!category) {
                return res.status(404).json({
                    'http-status-code': 404,
                    message: "Not Found",
                })
            }
        } catch (error) {
            res.status(400).json({
                'http-status-code': 400,
                message: error.message
            })
        }
    },
    async createCategoryModel(req, res) {
        try {
            // Validate dữ liệu từ request body
            const categoryData = { ...req.body };
            await createValidate.validateAsync(categoryData, { abortEarly: false });

            // Tạo category mới trong database
            const category = await CategoryModel.create(categoryData);
            res.status(200).json({
                'http-status-code': 200,
                message: "Thêm thành công",
                data: category,
            });
        } catch (error) {
            // Kiểm tra lỗi validate của Joi
            if (error.isJoi) {
                const errors = error.details.map((err) => err.message);
                return res.status(400).json({
                    'http-status-code': 400,
                    message: errors,
                });
            }

            // Xử lý các lỗi khác
            res.status(400).json({
                'http-status-code': 400,
                message: error.message
            });
        }
    },
    async updateCategoryModel(req, res) {
        try {
            const categoryId = req.params.id;
            const categoryData = req.body;
            const { error } = updateValidate.validate(req.body);
            if ( error ) {
                const errors = error.details.map((err) => err.message);
                return res.status(400).json({
                    'http-status-code': 400,
                    message: errors,
                })
            }
            const updateCategory = await CategoryModel.findByIdAndUpdate(
                categoryId,
                categoryData,
                { new: true }
            )
            res.status(200).json({
                'http-status-code': 200,
                message: "Cập nhật thành công",
                data: updateCategory,
            });
        } catch (error) {
            res.status(400).json({
                'http-status-code': 400,
                message: error.message
            })
        }
    },

    async deleteCategory(req, res) {
        try {
            const category = await CategoryModel.findByIdAndDelete(req.params.id);
            if (!category) {
                return res.status(404).json({
                    'http-status-code': 404,
                    message: "Not Found",
                })
            }
            res.status(200).json({
                'http-status-code': 200,
                message: "Xóa thành công",
            });
        } catch (error) {
            res.status(400).json({
                'http-status-code': 400,
                message: error.message
            })
        }
    }
}

export default CategoryController;
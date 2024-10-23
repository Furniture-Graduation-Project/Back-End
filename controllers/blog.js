import { StatusCodes } from "http-status-codes";
import BlogModel from "../models/blog.js";
import { blogSchema } from "../validations/blog.js";

const BlogController = {
  getAllBlogs: async (req, res) => {
    try {
      const blogs = await BlogModel.find();
      return res.status(StatusCodes.OK).json({
        message: "Lấy tất cả bài viết thành công",
        data: blogs,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const blogs = await BlogModel.find().skip(skip).limit(limit);

      if (!blogs || blogs.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không có bài viết nào tồn tại." });
      }

      const totalData = await BlogModel.countDocuments();
      const totalPage = limit ? Math.ceil(totalData / limit) : 1;
      return res.status(StatusCodes.OK).json({
        data: blogs,
        totalPage,
        totalData,
        message: "Lấy danh sách bài viết thành công.",
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi lấy danh sách bài viết.",
        error: error.message,
      });
    }
  },

  getBlogById: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy bài viết" });
    }
    try {
      const blog = await BlogModel.findById(id);
      if (!blog) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy bài viết" });
      }
      return res.status(StatusCodes.OK).json({
        message: "Lấy chi tiết bài viết thành công",
        data: blog,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  createBlog: async (req, res) => {
    try {
      const { value, error } = blogSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }
      const newBlog = new BlogModel(value);
      await newBlog.save();
      return res.status(StatusCodes.CREATED).json({
        message: "Tạo bài viết thành công",
        data: newBlog,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  updateBlogById: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy bài viết" });
    }
    try {
      const { value, error } = blogSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }

      const updatedBlog = await BlogModel.findByIdAndUpdate(id, value, {
        new: true,
      });

      if (!updatedBlog) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy bài viết để cập nhật" });
      }

      return res.status(StatusCodes.OK).json({
        message: "Cập nhật bài viết thành công",
        data: updatedBlog,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  deleteBlogById: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy bài viết" });
    }
    try {
      const deletedBlog = await BlogModel.findByIdAndDelete(id);
      if (!deletedBlog) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy bài viết để xóa" });
      }
      return res.status(StatusCodes.OK).json({
        message: "Xóa bài viết thành công",
        data: deletedBlog,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  getBlogsByAuthorId: async (req, res) => {
    const { authorId } = req.params;
    if (!authorId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy ID tác giả" });
    }
    try {
      const blogs = await BlogModel.find({ authorId }); // Giả sử trường lưu trữ ID tác giả trong BlogModel là authorId
      if (!blogs || blogs.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy bài viết nào của tác giả này." });
      }
      return res.status(StatusCodes.OK).json({
        message: "Lấy bài viết theo tác giả thành công",
        data: blogs,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },
};

export default BlogController;

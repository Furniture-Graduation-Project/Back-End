import { StatusCodes } from "http-status-codes";
import BlogModel from "../models/blog.js";
import { blogSchema } from "../validations/blog.js";

const BlogController = {
  // Lấy danh sách bài viết phân trang
  getPaginatedBlogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      // Sử dụng Promise.all để thực hiện truy vấn song song
      const [blogs, totalBlogs] = await Promise.all([
        BlogModel.find()
          .skip(skip)
          .limit(limit)
          .populate({
            path: "authorId",
          })
          .lean(), // Sử dụng lean() để chỉ lấy dữ liệu đơn giản, không phải đối tượng Mongoose đầy đủ
        BlogModel.countDocuments(),
      ]);

      if (!blogs || blogs.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không có bài viết nào tồn tại." });
      }

      const totalPages = Math.ceil(totalBlogs / limit);

      return res.status(StatusCodes.OK).json({
        blogs,
        page,
        totalPages,
        totalBlogs,
        message: "Danh sách bài viết đã được lấy thành công.",
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Có lỗi xảy ra khi lấy danh sách bài viết." });
    }
  },

  // Lấy tất cả bài blog
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

  // Lấy bài blog theo ID
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
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy bài viết",
        });
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

  // Tạo mới bài blog
  createBlog: async (req, res) => {
    try {
      const { value, error } = blogSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Lỗi: " + errors.join(", "),
        });
      }

      const blog = await BlogModel.create(value);
      return res.status(StatusCodes.CREATED).json({
        message: "Tạo bài viết thành công",
        data: blog,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  // Cập nhật bài blog theo ID
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
        const errors = error.details.map((err) => err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Lỗi: " + errors.join(", "),
        });
      }
      const blog = await BlogModel.findByIdAndUpdate(id, value, {
        new: true,
      });
      if (!blog) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy bài viết",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Cập nhật bài viết thành công",
        data: blog,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  // Xóa bài blog theo ID
  deleteBlogById: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy bài viết" });
    }
    try {
      const blog = await BlogModel.findByIdAndDelete(id);
      if (!blog) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy bài viết",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Xóa bài viết thành công",
        data: blog,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi: " + error.message,
      });
    }
  },

  // Lấy tất cả bài blog theo tác giả
  getBlogsByAuthorId: async (req, res) => {
    const { authorId } = req.params;
    if (!authorId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy tác giả" });
    }
    try {
      const blogs = await BlogModel.find({ authorId });
      if (blogs.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Tác giả này chưa có bài viết nào.",
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Lấy bài viết của tác giả thành công",
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

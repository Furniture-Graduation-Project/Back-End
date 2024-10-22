import { Router } from "express";
import BlogController from "../controllers/blog.js";

const routerBlog = new Router();

routerBlog.get("/", BlogController.getAllBlogs);
routerBlog.get("/limited", BlogController.getLimited);
routerBlog.get("/:id", BlogController.getBlogById);
routerBlog.post("/", BlogController.createBlog);
routerBlog.put("/:id", BlogController.updateBlogById);
routerBlog.delete("/:id", BlogController.deleteBlogById);
routerBlog.get("/author/:authorId", BlogController.getBlogsByAuthorId);

export default routerBlog;

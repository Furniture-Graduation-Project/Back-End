import { Router } from "express";
import BlogController from "../controllers/blog.js";
import protectRoute from "../middleware/protectRoute.js";
import protectSupport from "../middleware/protectSupport.js";
const routerBlog = new Router();

routerBlog.get("/", BlogController.getAllBlogs);
routerBlog.get("/limited", BlogController.getLimited);
routerBlog.get("/:id", BlogController.getBlogById);
routerBlog.post("/", protectRoute, protectSupport, BlogController.createBlog);
routerBlog.put(
  "/:id",
  protectRoute,
  protectSupport,
  BlogController.updateBlogById
);
routerBlog.delete(
  "/:id",
  protectRoute,
  protectSupport,
  BlogController.deleteBlogById
);
routerBlog.get("/employee/:employeeId", BlogController.getBlogsByEmployeeId);

export default routerBlog;

import { Router } from "express";
import BlogController from "../controllers/blog.js";
import protectRoute from "../middleware/protectRoute.js";
import protectSupport from "../middleware/protectSupport.js";
import protectAdmin from "../middleware/protectAdmin.js";
const routerBlog = new Router();

routerBlog.get("/", BlogController.getAllBlogs);
routerBlog.get("/limited", BlogController.getLimited);
routerBlog.get("/:id", BlogController.getBlogById);
routerBlog.post(
  "/",
  protectRoute,
  protectSupport,
  protectAdmin,
  BlogController.createBlog
);
routerBlog.put(
  "/:id",
  protectRoute,
  protectSupport,
  protectAdmin,
  BlogController.updateBlogById
);
routerBlog.delete(
  "/:id",
  protectRoute,
  protectSupport,
  protectAdmin,
  BlogController.deleteBlogById
);
routerBlog.get("/employee/:employeeId", BlogController.getBlogsByEmployeeId);

export default routerBlog;

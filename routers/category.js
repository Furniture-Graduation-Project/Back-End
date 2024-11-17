import { Router } from "express";
import CategoryController from "../controllers/category.js";
import protectRoute from "../middleware/protectRoute.js";
import protectProduct from "../middleware/protectProduct.js";

const router = Router();

router.get("/", CategoryController.getAll);
router.get("/limited", CategoryController.getLimited);
router.get("/:id", CategoryController.getCategoryById);
router.post("/", protectRoute, protectProduct, CategoryController.create);
router.put(
  "/:id",
  protectRoute,
  protectProduct,
  CategoryController.updateCategoryById
);
router.get("/search", CategoryController.searchByName);
export default router;

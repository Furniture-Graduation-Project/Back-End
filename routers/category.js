import { Router } from "express";
import CategoryController from "../controllers/category.js";
import protectRoute from "../middleware/protectRoute.js";
import protectProduct from "../middleware/protectProduct.js";
import protectAdmin from "../middleware/protectAdmin.js";

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
router.delete(
  "/:id",
  protectRoute,
  protectProduct,
  CategoryController.deleteCategoryById
);
export default router;

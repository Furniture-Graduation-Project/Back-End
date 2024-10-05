import { Router } from "express";
import CategoryController from "../controllers/category.js";

const router = Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.deleteCategoryById);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.updateCategoryById);
router.delete("/:id", CategoryController.deleteCategoryById);

export default router;

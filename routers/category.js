import { Router } from "express";
import CategoryController from "../controllers/category.js";

const router = Router();

router.get("/", CategoryController.getAll);
router.get("/limited", CategoryController.getLimited);
router.get("/:id", CategoryController.getCategoryById);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.updateCategoryById);
router.get('/search', CategoryController.searchByName);
export default router;

import { Router } from "express";
import CategoryController from "../controllers/category.js";

const router  = Router();

router.get('/', CategoryController.getAllCategoryModel);
router.get('/:id', CategoryController.detailCategoryModel);
router.post('/', CategoryController.createCategoryModel);
router.put('/:id', CategoryController.updateCategoryModel);
router.delete('/:id', CategoryController.deleteCategory);

export default router;
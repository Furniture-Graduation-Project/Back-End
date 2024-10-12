import { Router } from "express";
import { ProductController } from "../controllers/product.js";

const router = Router();

router.get("", ProductController.getAll);
router.get("/limited", ProductController.getLimited);
router.get("/:id", ProductController.getById);
router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export default router;

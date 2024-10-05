import { Router } from "express";
import ProductController from "../controllers/product.js";

const router = Router();
router.get("", ProductController.getAllProduct);
router.get("/limited", ProductController.getLimitedProduct);
router.get("/:id", ProductController.detailProduct);
router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export default router;

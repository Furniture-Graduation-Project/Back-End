import { Router } from "express";
import { ProductController } from "../controllers/product.js";
import protectAdmin from "../middleware/protectAdmin.js";
import protectRoute from "../middleware/protectRoute.js";
import protectProduct from "../middleware/protectProduct.js";

const router = Router();

router.get("", ProductController.getAll);
router.get("/new", ProductController.getProductNew);
router.get("/limited", ProductController.getLimited);
router.get("/search", ProductController.getByName);
router.get("/count", ProductController.countProduct);
router.get("/count-by-category", ProductController.countProductsByCategory);
router.get("/count-by-material", ProductController.countProductsByMaterial);
router.get("/:id", ProductController.getById);
router.post("/", protectRoute, protectProduct, ProductController.createProduct);
router.put(
  "/:id",
  protectRoute,
  protectProduct,
  ProductController.updateProduct
);
router.delete(
  "/:id",
  protectRoute,
  protectProduct,
  ProductController.deleteProduct
);
router.get("/:id/with-price", ProductController.getIdWithPrice);
export default router;

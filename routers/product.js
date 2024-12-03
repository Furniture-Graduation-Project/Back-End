import { Router } from "express";
import { ProductController } from "../controllers/product.js";
import protectAdmin from "../middleware/protectAdmin.js";
import protectRoute from "../middleware/protectRoute.js";
import protectProduct from "../middleware/protectProduct.js";

const router = Router();

router.get("", ProductController.getAll);
router.get("/new", ProductController.getProductNew);
router.get("/limited", ProductController.getLimited);
router.get("/limited-items", ProductController.getLimitedAndItems);
router.get("/search", ProductController.getByName);
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
  protectAdmin,
  ProductController.deleteProduct
);
export default router;

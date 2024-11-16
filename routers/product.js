import { Router } from "express";
import { ProductController } from "../controllers/product.js";
import protectAdmin from "../middleware/protectAdmin.js";
import protectRoute from "../middleware/protectRoute.js";
import protectProduct from "../middleware/protectProduct.js";
import protectOrder from "../middleware/protectOrder.js";
import protectSupport from "../middleware/protectSupport.js";

const router = Router();

router.get(
  "",
  protectRoute,
  protectAdmin,
  protectProduct,
  protectOrder,
  protectSupport,
  ProductController.getAll
);
router.get("/limited", ProductController.getLimited);
router.get("/search", ProductController.getByName);
router.get(
  "/:id",
  protectRoute,
  protectAdmin,
  protectProduct,
  ProductController.getById
);
router.post(
  "/",
  protectRoute,
  protectAdmin,
  protectProduct,
  ProductController.createProduct
);
router.put(
  "/:id",
  protectRoute,
  protectAdmin,
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

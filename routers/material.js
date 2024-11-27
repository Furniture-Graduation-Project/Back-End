import { Router } from "express";
import MaterialController from "../controllers/material.js";
import protectRoute from "../middleware/protectRoute.js";
import protectProduct from "../middleware/protectProduct.js";

const router = Router();

router.get("/", MaterialController.getAll);
router.get("/limited", MaterialController.getLimited);
router.get("/:id", MaterialController.getMaterialById);
router.post("/", protectRoute, protectProduct, MaterialController.create);
router.put(
  "/:id",
  protectRoute,
  protectProduct,
  MaterialController.updateMaterialById
);
router.get("/search", MaterialController.searchByName);

export default router;

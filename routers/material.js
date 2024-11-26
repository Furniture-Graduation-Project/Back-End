import { Router } from "express";
import MaterialController from "../controllers/material.js";

const router = Router();

router.get("/", MaterialController.getAll);
router.get("/limited", MaterialController.getLimited);
router.get("/:id", MaterialController.getMaterialById);
router.post("/", MaterialController.create);
router.put("/:id", MaterialController.updateMaterialById);
router.get("/search", MaterialController.searchByName);
router.delete("/:id", MaterialController.deleteMaterialById);
export default router;

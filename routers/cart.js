import express from "express";
import CartController from "../controllers/cart.js";

const router = express.Router();

router.get("/", CartController.getAll);
router.get("/limited", CartController.getLimited);
router.get("/:id", CartController.detail);
router.post("/", CartController.create);
router.put("/:id", CartController.update);
router.delete("/:id", CartController.delete);

export default router;

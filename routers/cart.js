import express from "express";
import CartController from "../controllers/cart.js";

const router = express.Router();

router.get("/", CartController.getAllCarts);
router.get("/:id", CartController.detailCart);
router.post("/", CartController.createCart);
router.put("/:id", CartController.updateCart);
router.delete("/:id", CartController.deleteCart);

export default router;

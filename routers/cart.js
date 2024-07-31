import express from "express";
import {
  addItemToCart,
  deleteCart,
  getCart,
  removeItemFromCart,
  updateCartItem,
} from "../controllers/cart.js";

const router = express.Router();

router.get("/:UserID", getCart);
router.post("/item", addItemToCart);
router.put("/item/:UserID", updateCartItem);
router.delete("/item/:UserID/:ProductID/:ProductOption", removeItemFromCart);
router.delete("/:UserID", deleteCart);

export default router;

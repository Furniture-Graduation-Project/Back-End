import express from "express";
import { cartValidation } from "../validations/cartValidation.js";
import { validate } from "../validations/validate.js";
import * as cartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/:UserID", cartController.getCart);
router.post("/item", validate(cartValidation), cartController.addItemToCart);
router.put(
  "/item/:UserID",
  validate(cartValidation),
  cartController.updateCartItem
);
router.delete(
  "/item/:UserID/:ProductID/:ProductOption",
  cartController.removeItemFromCart
);
router.delete("/:UserID", cartController.deleteCart);

export default router;

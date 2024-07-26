import express from "express";
import { cartValidation } from "../validations/cartValidation.js";
import { validate } from "../validations/validate.js";
import * as cartController from "../controllers/cartController.js";

const routerCart = express.Router();

routerCart.get("/:UserID", cartController.getCart);
routerCart.post(
  "/item",
  validate(cartValidation),
  cartController.addItemToCart
);
routerCart.put(
  "/item/:UserID",
  validate(cartValidation),
  cartController.updateCartItem
);
routerCart.delete(
  "/item/:UserID/:ProductID/:ProductOption",
  cartController.removeItemFromCart
);
routerCart.delete("/:UserID", cartController.deleteCart);

export default routerCart;

import express from "express";
import CartController from "../controllers/cart.js";

const routerCart = express.Router();

routerCart.get("/", CartController.getAll);
routerCart.get("/limited", CartController.getLimited);
routerCart.get("/:id", CartController.getById);
routerCart.post("/", CartController.create);
routerCart.put("/:id", CartController.update);
routerCart.delete("/:productID/:productItemID", CartController.delete);
routerCart.patch("/increase/:userId/:productId/:productItemId", CartController.increaseQuantity)
routerCart.patch("/decrease/:userId/:productId/:productItemId", CartController.decreaseQuantity)

export default routerCart;

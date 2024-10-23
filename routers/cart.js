import express from "express";
import CartController from "../controllers/cart.js";

const routerCart = express.Router();

routerCart.get("/", CartController.getAll);
routerCart.get("/limited", CartController.getLimited);
routerCart.get("/:id", CartController.getById);
routerCart.post("/", CartController.create);
routerCart.put("/:id", CartController.update);
routerCart.delete("/:id", CartController.delete);

export default routerCart;

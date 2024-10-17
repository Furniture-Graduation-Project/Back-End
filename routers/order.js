import { Router } from "express";
import OrderController from "../controllers/order.js";

const orderRouter = new Router();

orderRouter.get("/", OrderController.getAll);
orderRouter.get("/limited", OrderController.getLimited);
orderRouter.get("/order/:id", OrderController.getByIdOrder);
orderRouter.get("/user/:id", OrderController.getByIdUser);
orderRouter.post("/", OrderController.create);
orderRouter.put("/:id", OrderController.update);
orderRouter.delete("/:id", OrderController.delete);

export default orderRouter;

import { Router } from "express";
import OrderController from "../controllers/order.js";

const orderRouter = Router();

orderRouter.get("/", OrderController.getAll);
orderRouter.get("/order/:id", OrderController.getByIdOrder);
orderRouter.get("/user/:id", OrderController.getByIdUser);
orderRouter.post("/", OrderController.add);
orderRouter.put("/:id", OrderController.update);
orderRouter.delete("/:id", OrderController.delete);

export default orderRouter;

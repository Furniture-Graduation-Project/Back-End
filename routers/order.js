import { Router } from "express";
import OrderController from "../controllers/order.js";
import protectRoute from "../middleware/protectRoute.js";
import protectOrder from "../middleware/protectOrder.js";
import protectAdmin from "../middleware/protectAdmin.js";

const orderRouter = new Router();

orderRouter.get("/", OrderController.getAll);
orderRouter.get("/limited", OrderController.getLimited);
orderRouter.get("/:id", OrderController.getByIdOrder);
orderRouter.get("/user/:id", OrderController.getByIdUser);

orderRouter.post(
  "/",
  protectRoute,
  protectOrder,
  protectAdmin,
  OrderController.create
);
orderRouter.put(
  "/:id",
  protectRoute,
  protectOrder,
  protectAdmin,
  OrderController.update
);
orderRouter.delete(
  "/:id",
  protectRoute,
  protectOrder,
  protectAdmin,
  OrderController.delete
);

export default orderRouter;

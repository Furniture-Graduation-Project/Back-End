import express from "express";
import VoucherController from "../controllers/voucher.js";
import protectRoute from "../middleware/protectRoute.js";
import protectProduct from "../middleware/protectProduct.js";
const routerVoucher = express.Router();

routerVoucher.post("/", protectRoute, protectProduct, VoucherController.create);
routerVoucher.get("/", protectRoute, protectProduct, VoucherController.getAll);
routerVoucher.get("/:id", VoucherController.getById);
routerVoucher.get("/limited", VoucherController.getLimited);
routerVoucher.put(
  "/:id",
  protectRoute,
  protectProduct,
  VoucherController.update
);
routerVoucher.delete(
  "/:id",
  protectRoute,
  protectProduct,
  VoucherController.delete
);

export default routerVoucher;

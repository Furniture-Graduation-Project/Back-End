import express from "express";
import VoucherController from "../controllers/voucher.js";
import protectAdmin from "../middleware/protectAdmin.js";
import protectRoute from "../middleware/protectRoute.js";
import protectProduct from "../middleware/protectProduct.js";
const routerVoucher = express.Router();

routerVoucher.post(
  "/",
  protectRoute,
  protectAdmin,
  protectProduct,
  VoucherController.create
);
routerVoucher.get(
  "/",
  protectRoute,
  protectAdmin,
  protectProduct,
  VoucherController.getAll
);
routerVoucher.get("/:id", VoucherController.getById);
routerVoucher.get("/limited", VoucherController.getLimited);
routerVoucher.put(
  "/:id",
  protectRoute,
  protectAdmin,
  protectProduct,
  VoucherController.update
);
routerVoucher.delete(
  "/:id",
  protectRoute,
  protectAdmin,
  protectProduct,
  VoucherController.delete
);

export default routerVoucher;

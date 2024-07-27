import express from "express";
import {
  createVoucher,
  getVouchers,
  updateVoucher,
  deleteVoucher,
  getVoucherById,
} from "../controllers/voucherController.js";

const routerVoucher = express.Router();

routerVoucher.post("/", createVoucher);
routerVoucher.get("/", getVouchers);

routerVoucher.get("/:id", getVoucherById);
routerVoucher.put("/:id", updateVoucher);
routerVoucher.delete("/:id", deleteVoucher);

export default routerVoucher;

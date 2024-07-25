import express from "express";
import {
  createVoucher,
  getVouchers,
  updateVoucher,
  deleteVoucher,
  getVoucherById,
} from "../controllers/voucherController.js";
import { validateVoucher } from "../validations/voucherValidation.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, validateVoucher, createVoucher)
  .get(authMiddleware, getVouchers);

router
  .route("/:id")
  .get(authMiddleware, getVoucherById)
  .put(authMiddleware, validateVoucher, updateVoucher)
  .delete(authMiddleware, deleteVoucher);

export default router;

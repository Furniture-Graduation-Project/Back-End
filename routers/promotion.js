import express from "express";
import {
  createPromotion,
  getPromotions,
  updatePromotion,
  deletePromotion,
  getPromotionById,
} from "../controllers/promotionController.js";
import { validatePromotion } from "../validations/promotionValidation.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, validatePromotion, createPromotion)
  .get(authMiddleware, getPromotions);

router
  .route("/:id")
  .get(authMiddleware, getPromotionById)
  .put(authMiddleware, validatePromotion, updatePromotion)
  .delete(authMiddleware, deletePromotion);

export default router;

import express from "express";
import {
  createPromotion,
  getPromotions,
  updatePromotion,
  deletePromotion,
  getPromotionById,
} from "../controllers/promotionController.js";

const routerPromotion = express.Router();

routerPromotion.post("/", createPromotion);
routerPromotion.get("/", getPromotions);

routerPromotion.get("/:id", getPromotionById);
routerPromotion.put("/:id",  updatePromotion);
routerPromotion.delete("/:id", deletePromotion);

export default routerPromotion;

import express from "express";
import PromotionController from "../controllers/promotion.js";

const routerPromotion = express.Router();

routerPromotion.get("/", PromotionController.getAll);
routerPromotion.get("/:id", PromotionController.getById);
routerPromotion.post("/", PromotionController.create);
routerPromotion.put("/:id", PromotionController.update);
routerPromotion.delete("/:id", PromotionController.delete);

export default routerPromotion;

import express from 'express';
import {
  createPromotion,
  deletePromotion,
  getPromotionById,
  getPromotions,
  updatePromotion,
} from '../controllers/promotion.js';
const routerPromotion = express.Router();

routerPromotion.post('/', createPromotion);
routerPromotion.get('/', getPromotions);
routerPromotion.get('/:id', getPromotionById);
routerPromotion.put('/:id', updatePromotion);
routerPromotion.delete('/:id', deletePromotion);

export default routerPromotion;

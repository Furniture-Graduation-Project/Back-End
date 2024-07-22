import { Router } from "express";
import ProductController from '../controllers/product.js';

const router  = Router();

router.get('/', ProductController.getAllProductModel);
router.get('/:id', ProductController.detailProductModel);
router.post('/', ProductController.createProductModel);
router.put('/:id', ProductController.updateProductModel);
router.delete('/:id', ProductController.deleteProduct);

export default router;
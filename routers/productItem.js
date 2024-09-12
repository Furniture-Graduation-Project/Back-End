import { Router } from 'express';
import ProductItemController from '../controllers/productItem.js';

const productItemRouter = Router();

productItemRouter.get('/', ProductItemController.getAll);
productItemRouter.get('/:id', ProductItemController.getById);
productItemRouter.get('/product/:id', ProductItemController.getByProductId);
productItemRouter.post('/', ProductItemController.create);
productItemRouter.put('/:id', ProductItemController.update);
productItemRouter.delete('/:id', ProductItemController.delete);

export default productItemRouter;

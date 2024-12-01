import { Router } from 'express';
import OrderController from '../controllers/order.js';
import protectRouteClient from '../middleware/protectRouteClient.js';

const orderRouter = new Router();

orderRouter.get('/', OrderController.getAll);
orderRouter.get('/limited', OrderController.getLimited);
orderRouter.get('/:id', OrderController.getByIdOrder);
orderRouter.get('/user/:id', OrderController.getByIdUser);
orderRouter.post('/', OrderController.create);
orderRouter.post('/check', OrderController.checkProductOrder);
orderRouter.put('/:id', OrderController.update);
orderRouter.delete('/:id', OrderController.delete);

orderRouter.get(
  '/client/limited',
  protectRouteClient,
  OrderController.getLimited,
);
export default orderRouter;

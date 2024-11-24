import express from 'express';
import CartController from '../controllers/cart.js';
import protectRouteClient from '../middleware/protectRouteClient.js';

const routerCart = express.Router();

routerCart.get('/', CartController.getAll);
routerCart.get('/limited', CartController.getLimited);
routerCart.get('/:id', CartController.getById);
routerCart.post('/', protectRouteClient, CartController.create);
routerCart.put('/:id', CartController.update);
routerCart.delete(
  '/:productId/:productOptionId',
  protectRouteClient,
  CartController.delete,
);
routerCart.patch(
  '/increase/:productId/:productOptionId',
  protectRouteClient,
  CartController.increaseQuantity,
);
routerCart.patch(
  '/decrease/:productId/:productOptionId',
  protectRouteClient,
  CartController.decreaseQuantity,
);

export default routerCart;

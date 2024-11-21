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
  '/:productID/:productItemID',
  protectRouteClient,
  CartController.delete,
);
routerCart.patch(
  '/increase/:productId/:productItemId',
  protectRouteClient,
  CartController.increaseQuantity,
);
routerCart.patch(
  '/decrease/:productId/:productItemId',
  protectRouteClient,
  CartController.decreaseQuantity,
);

export default routerCart;

import { Router } from 'express';
import WishlistController from '../controllers/wishlist.js';
const routerWishlist = new Router();

routerWishlist.get('/', WishlistController.getAll);
routerWishlist.get('/:id', WishlistController.getDetail);
routerWishlist.post('/', WishlistController.create);
routerWishlist.put('/:id', WishlistController.edit);
routerWishlist.delete('/', WishlistController.delete);

export default routerWishlist;

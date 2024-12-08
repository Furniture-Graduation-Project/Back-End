import { Router } from "express";
import WishlistController from "../controllers/wishlist.js";
const routerWishlist = new Router();

routerWishlist.get("/", WishlistController.getAll);
routerWishlist.get("/limited", WishlistController.getLimited);
routerWishlist.get("/:userId", WishlistController.getByUserId);
routerWishlist.post("/:userId", WishlistController.create);
routerWishlist.put("/:id", WishlistController.edit);
routerWishlist.delete("/:userId/remove", WishlistController.delete);

export default routerWishlist;

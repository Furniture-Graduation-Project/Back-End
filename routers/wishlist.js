import { Router } from "express";
import WishlistController from "../controllers/wishlist.js";
const routerWishlist = new Router();

routerWishlist.get("/", WishlistController.getAll);
routerWishlist.get("/limited", WishlistController.getLimited);
routerWishlist.get("/:id", WishlistController.getDetail);
routerWishlist.post("/", WishlistController.create);
routerWishlist.put("/:id", WishlistController.edit);
routerWishlist.delete("/:id", WishlistController.delete);

export default routerWishlist;

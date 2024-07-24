import { Router } from "express";
import {
  createWishlist,
  deleteWishlist,
  editWishlist,
  getAllWishlist,
  getDetailwishlist,
} from "../controllers/wishlist";
const routerWishlist = new Router();

routerWishlist.get("/wishlist", getAllWishlist);
routerWishlist.get("/wishlist/:id", getDetailwishlist);
routerWishlist.post("/wishlist", createWishlist);
routerWishlist.put("/wishlist/:id", editWishlist);
routerWishlist.delete("/wishlist", deleteWishlist);

export default routerWishlist;

import { Router } from "express";
import {
  createWishlist,
  deleteWishlist,
  editWishlist,
  getAllWishlist,
  getDetailwishlist,
} from "../controllers/wishlist";
const routerWishlist = new Router();

routerWishlist.get("/", getAllWishlist);
routerWishlist.get("/:id", getDetailwishlist);
routerWishlist.post("/", createWishlist);
routerWishlist.put("/:id", editWishlist);
routerWishlist.delete("/", deleteWishlist);

export default routerWishlist;

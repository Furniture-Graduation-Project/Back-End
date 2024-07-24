import { Router } from "express";
import {
    createWishlist,
    deleteWishlist,
    editWishlist,
    getAllWishlist,
    getDetailWishlist,
} from "../controllers/wishlist.js";
const routerWishlist = new Router();

routerWishlist.get("/", getAllWishlist);
routerWishlist.get("/:id", getDetailWishlist);
routerWishlist.post("/", createWishlist);
routerWishlist.put("/:id", editWishlist);
routerWishlist.delete("/", deleteWishlist);

export default routerWishlist;

import { Router } from "express";
import {
  createReview,
  deleteReview,
  editReview,
  getAllReview,
  getDetailReview,
} from "../controllers/review.js";

const routerReview = new Router();
routerReview.get("/", getAllReview);
routerReview.get("/:id", getDetailReview);
routerReview.post("/", createReview);
routerReview.put("/:id", editReview);
routerReview.get("/:id", deleteReview);
export default routerReview;

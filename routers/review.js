import { Router } from "express";
import {
  createReview,
  deleteReview,
  editReview,
  getAllReview,
  getDetailReview,
} from "../controllers/review.js";

const routerReview = new Router();
routerReview.get("/review", getAllReview);
routerReview.get("/review/:id", getDetailReview);
routerReview.post("/review", createReview);
routerReview.put("/review/:id", editReview);
routerReview.get("/review/:id", deleteReview);
export default routerReview;

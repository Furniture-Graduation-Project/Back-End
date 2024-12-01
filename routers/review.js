import { Router } from "express";
import ReviewController from "../controllers/review.js";

const routerReview = new Router();

routerReview.get("/", ReviewController.getAll);
routerReview.get("/:id", ReviewController.getDetail);
routerReview.post("/", ReviewController.create);
routerReview.put("/:id", ReviewController.edit);
routerReview.delete("/", ReviewController.delete);

export default routerReview;

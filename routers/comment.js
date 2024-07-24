import { Router } from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getAllComment,
  getDetailComment,
} from "../controllers/comment.js";

const routerComment = new Router();

routerComment.get("/", getAllComment);
routerComment.get("/:id", getDetailComment);
routerComment.post("/", createComment);
routerComment.put("/:id", editComment);
routerComment.delete("/", deleteComment);

export default routerComment;

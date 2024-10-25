import { Router } from "express";
import {
  create,
  getByUserId,
  remove,
  update,
} from "../controllers/location.js";

const router = Router();

router.post("/:userId", create);
router.get("/:userId", getByUserId);
router.delete("/:locationsId", remove);
router.put("/:id", update);

export default router;

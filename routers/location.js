import { Router } from "express";
import {
  create,
  get,
  removeLocation,
  remove,
  update,
  getByUserId,
} from "../controllers/location.js";

const router = Router();

router.post("/:userId", create);
router.get("/:userId", getByUserId);
router.get("/", get);
router.delete("/:id", remove);
router.delete("/:locationsId", removeLocation);
router.put("/:id", update);

export default router;

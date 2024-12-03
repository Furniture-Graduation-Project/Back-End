import { Router } from "express";
import {
  create,
  getByUserId,
  getOne,
  remove,
  update,
} from "../controllers/location.js";
import { getAllLocation } from "../services/locations.js";

const router = Router();

router.get("/", getAllLocation);
router.post("/:userId", create);
router.get("/:userId", getByUserId);
router.get("/:userId/location", getOne);
router.delete("/:userId/location", remove);
router.put("/:userId/location", update);

export default router;

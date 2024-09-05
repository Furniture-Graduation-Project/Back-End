import { Router } from "express";
import LocationController from "../controllers/location";

const router = Router();

router.post("/", LocationController.create);
router.get("/:id", LocationController.get);
router.delete("/", LocationController.delete);
router.delete("/:id", LocationController.removeLocation);
router.put("/", LocationController.update);

export default router;

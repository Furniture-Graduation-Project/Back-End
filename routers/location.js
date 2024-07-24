import { Router } from "express";
import {
    create,
    get,
    remove,
    removeLocation,
    update,
} from "../controllers/location.js";

const router = Router();

router.post("/", create);
router.get("/:id", get);
router.delete("/", remove);
router.delete("/:id", removeLocation);
router.put("/", update);

export default router;

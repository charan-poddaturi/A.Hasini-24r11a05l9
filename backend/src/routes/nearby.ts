import { Router } from "express";
import { getNearby } from "../controllers/nearbyController";

const router = Router();

router.get("/:category", getNearby);

export default router;

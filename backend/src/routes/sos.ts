import { Router } from "express";
import { triggerSOS, getHistory, getAllAlerts } from "../controllers/sosController";
import { authenticate, authorize } from "../middlewares/auth";
import { sosRateLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.post("/trigger", authenticate, sosRateLimiter, triggerSOS);
router.get("/history", authenticate, getHistory);
router.get("/all", authenticate, authorize(["admin"]), getAllAlerts);

export default router;

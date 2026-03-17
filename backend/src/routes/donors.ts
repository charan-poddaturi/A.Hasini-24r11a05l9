import { Router } from "express";
import {
  searchDonors,
  registerDonor,
  updateDonorAvailability,
  requestDonor,
  verifyDonor,
} from "../controllers/donorController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.get("/search", searchDonors);
router.post("/register", authenticate, registerDonor);
router.put("/availability", authenticate, updateDonorAvailability);
router.post("/request", authenticate, requestDonor);
router.put("/verify/:id", authenticate, authorize(["admin"]), verifyDonor);

export default router;

import { Router } from "express";
import {
  getProfile,
  updateProfile,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../controllers/userController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/emergency-contacts", addEmergencyContact);
router.put("/emergency-contacts/:id", updateEmergencyContact);
router.delete("/emergency-contacts/:id", deleteEmergencyContact);

export default router;

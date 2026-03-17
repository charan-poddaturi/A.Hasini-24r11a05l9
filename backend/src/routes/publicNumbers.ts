import { Router } from "express";
import { getPublicNumbers, listPublicNumbers } from "../controllers/publicNumbersController";

const router = Router();

router.get("/", listPublicNumbers);
router.get("/:country", getPublicNumbers);

export default router;

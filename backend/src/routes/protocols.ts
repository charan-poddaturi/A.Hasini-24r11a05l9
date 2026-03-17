import { Router } from "express";
import { listProtocols } from "../controllers/protocolsController";

const router = Router();

router.get("/", listProtocols);

export default router;

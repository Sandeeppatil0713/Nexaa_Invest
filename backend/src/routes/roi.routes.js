import { Router } from "express";
import { getRoiHistory } from "../controllers/roi.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/history", getRoiHistory);

export default router;

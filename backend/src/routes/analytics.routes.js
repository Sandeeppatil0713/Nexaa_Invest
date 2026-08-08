import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/", protect, getAnalytics);

export default router;

import { Router } from "express";
import {
  getReferralIncome,
  getReferralTree,
} from "../controllers/referral.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/income", getReferralIncome);
router.get("/tree", getReferralTree);

export default router;

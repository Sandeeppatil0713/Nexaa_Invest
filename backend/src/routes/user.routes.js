import { Router } from "express";
import { body } from "express-validator";
import {
  getProfile,
  getWallet,
  requestWithdrawal,
} from "../controllers/user.controller.js";
import { runValidators } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/profile", getProfile);
router.get("/wallet", getWallet);

router.post(
  "/withdraw",
  runValidators(
    body("amount")
      .isNumeric().withMessage("Amount must be a number")
      .custom((v) => Number(v) >= 100).withMessage("Minimum withdrawal is ₹100"),
  ),
  requestWithdrawal,
);

export default router;

import { Router } from "express";
import { body } from "express-validator";
import {
  getInvestments,
  getInvestmentById,
  createInvestment,
} from "../controllers/investment.controller.js";
import { runValidators } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", getInvestments);
router.get("/:id", getInvestmentById);

router.post(
  "/",
  runValidators(
    body("plan")
      .isIn(["Starter", "Professional", "Enterprise"])
      .withMessage("Plan must be Starter, Professional or Enterprise"),
    body("amount")
      .isNumeric().withMessage("Amount must be a number")
      .custom((v) => Number(v) > 0).withMessage("Amount must be positive"),
  ),
  createInvestment,
);

export default router;

import { Router } from "express";
import { body } from "express-validator";
import { subscribe } from "../controllers/subscriber.controller.js";
import { runValidators } from "../middleware/validate.js";

const router = Router();

router.post(
  "/",
  runValidators(
    body("email").isEmail().normalizeEmail().withMessage("Valid email address is required"),
  ),
  subscribe,
);

export default router;

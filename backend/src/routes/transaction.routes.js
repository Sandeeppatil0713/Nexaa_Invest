import { Router } from "express";
import { getTransactions } from "../controllers/transaction.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getTransactions);

export default router;

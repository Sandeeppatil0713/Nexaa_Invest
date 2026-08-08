import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { startRoiCron } from "./src/jobs/roiCron.js";

// ─── Route modules ────────────────────────────────────────────────────────────
import authRoutes        from "./src/routes/auth.routes.js";
import userRoutes        from "./src/routes/user.routes.js";
import investmentRoutes  from "./src/routes/investment.routes.js";
import roiRoutes         from "./src/routes/roi.routes.js";
import referralRoutes    from "./src/routes/referral.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";
import paymentRoutes     from "./src/routes/payment.routes.js";
import subscriberRoutes  from "./src/routes/subscriber.routes.js";
import adminRoutes       from "./src/routes/admin.routes.js";
import analyticsRoutes   from "./src/routes/analytics.routes.js";

// ─── Bootstrap ───────────────────────────────────────────────────────────────
await connectDB();
startRoiCron();

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} is not allowed`));
    },
    credentials: true,
  }),
);

// ─── Body / cookie / logging ──────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/user",         userRoutes);
app.use("/api/investments",  investmentRoutes);
app.use("/api/roi",          roiRoutes);
app.use("/api/referral",     referralRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/payments",     paymentRoutes);
app.use("/api/subscribe",    subscriberRoutes);
app.use("/api/admin",        adminRoutes);
app.use("/api/analytics",    analyticsRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => {
  console.log(
    `🚀  NexaInvest API running on port ${PORT} [${process.env.NODE_ENV ?? "development"}]`,
  );
});

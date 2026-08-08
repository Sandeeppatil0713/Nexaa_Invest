import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * protect — verifies the JWT from the Authorization header or the `token` cookie.
 * Attaches `req.user` (full Mongoose doc, no password) on success.
 */
export async function protect(req, res, next) {
  try {
    let token;

    // 1. Bearer token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }

    // 2. Fall back to httpOnly cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "User not found or inactive" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired, please login again" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

/**
 * adminOnly — must be used after protect().
 */
export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
}

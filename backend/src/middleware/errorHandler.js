/**
 * Central error handler — must be mounted last, after all routes.
 * eslint-disable-next-line no-unused-vars
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    return res.status(409).json({
      success: false,
      message: `${field} already in use`,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({
      success: false,
      message: messages.join(". "),
    });
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  const status = err.statusCode ?? err.status ?? 500;
  // Guard: status must be a valid HTTP integer (AppError.status can be "fail"/"error" string)
  const httpStatus = typeof status === "number" && status >= 100 && status <= 599 ? status : 500;
  const message =
    process.env.NODE_ENV === "production" && httpStatus === 500
      ? "Internal server error"
      : err.message ?? "Internal server error";

  // Log all errors in development
  console.error("[errorHandler]", err.stack ?? err.message);

  res.status(httpStatus).json({ success: false, message });
}

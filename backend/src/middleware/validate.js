import { validationResult, matchedData } from "express-validator";

/**
 * runValidators(...chains) — wraps express-validator chains into a single
 * middleware that is fully compatible with Express 5.
 *
 * Usage:
 *   router.post("/path", runValidators(
 *     body("field").notEmpty(),
 *     body("other").isEmail(),
 *   ), handler);
 *
 * This avoids the "next is not a function" bug that occurs in Express 5 when
 * validator chain objects are spread directly as route arguments.
 */
export function runValidators(...chains) {
  return async (req, res, next) => {
    // Run all chains in parallel
    await Promise.all(chains.map((chain) => chain.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }
    return next();
  };
}

/**
 * Legacy named export kept for any direct usage.
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return next();
}

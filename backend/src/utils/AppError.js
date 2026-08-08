/**
 * Operational error with an HTTP status code.
 * Throw this inside controllers/services to trigger the central error handler.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode; // always a number
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

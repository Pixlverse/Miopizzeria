// Centralised error handler.
// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ message: "Resource already exists", fields: err.keyValue });
  }
  // Mongoose validation
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }
  // Zod
  if (err.name === "ZodError") {
    return res.status(400).json({ message: "Validation failed", errors: err.issues });
  }

  return res.status(err.status || 500).json({ message: err.message || "Server error" });
};

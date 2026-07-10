// Wraps a Zod schema as Express middleware that validates req.body.
module.exports = function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }
    req.body = result.data;
    return next();
  };
};

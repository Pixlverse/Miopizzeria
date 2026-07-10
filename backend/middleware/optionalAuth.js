const jwt = require("jsonwebtoken");

// Populates req.user when a valid token is present, but never rejects.
module.exports = function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      /* ignore — treated as anonymous */
    }
  }
  return next();
};

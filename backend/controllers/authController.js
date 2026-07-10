const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signTokens(user) {
  const payload = { id: user._id, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "7d",
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d",
  });
  return { token, refreshToken };
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const tokens = signTokens(user);
    return res.json({
      ...tokens,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    return next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "refreshToken required" });
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const token = jwt.sign(
      { id: payload.id, email: payload.email, role: payload.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "7d" }
    );
    return res.json({ token });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

exports.logout = async (req, res) => res.json({ message: "Logged out" });

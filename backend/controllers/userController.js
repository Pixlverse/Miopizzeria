const User = require("../models/User");

// Admin: list all admin users (never expose password hashes).
exports.list = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: 1 });
    return res.json(users);
  } catch (err) {
    return next(err);
  }
};

// Admin: create a new admin user.
exports.create = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "That email is already registered" });
    const user = await User.create({ email, password, role: "admin" });
    return res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (err) {
    return next(err);
  }
};

// Admin: reset a user's password.
exports.updatePassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = password; // pre-save hook re-hashes
    await user.save();
    return res.json({ message: "Password updated" });
  } catch (err) {
    return next(err);
  }
};

// Admin: delete a user (can't delete yourself or the last admin).
exports.remove = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You can't delete your own account" });
    }
    const count = await User.countDocuments();
    if (count <= 1) {
      return res.status(400).json({ message: "At least one admin must remain" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
};

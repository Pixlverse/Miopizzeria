const MenuItem = require("../models/MenuItem");

exports.list = async (req, res, next) => {
  try {
    // Public callers see only active, non-archived items; admins see more.
    const filter = req.user ? {} : { status: "Active" };
    // Archived items are hidden by default; admins can request them explicitly.
    if (req.query.archived === "true") {
      filter.archived = true;
    } else {
      filter.archived = { $ne: true };
    }
    if (req.query.category && req.query.category !== "All") {
      filter.category = req.query.category;
    }
    const items = await MenuItem.find(filter).sort({ order: 1, createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.json(item);
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    return res.status(201).json(item);
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.json(item);
  } catch (err) {
    return next(err);
  }
};

// Soft delete: mark as archived (hidden everywhere) rather than destroying it.
exports.remove = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.json(item);
  } catch (err) {
    return next(err);
  }
};

// Restore a previously archived item.
exports.restore = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { archived: false },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.json(item);
  } catch (err) {
    return next(err);
  }
};

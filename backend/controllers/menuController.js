const MenuItem = require("../models/MenuItem");

exports.list = async (req, res, next) => {
  try {
    // Public callers see only active items; admins (authenticated) see all.
    const filter = req.user ? {} : { status: "Active" };
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

exports.remove = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
};

const PartyOrder = require("../models/PartyOrder");

// Public: submit a party-order / event request.
exports.create = async (req, res, next) => {
  try {
    const order = await PartyOrder.create(req.body);
    return res.status(201).json(order);
  } catch (err) {
    return next(err);
  }
};

// Admin: list requests, newest first. Optional ?status= filter.
exports.list = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== "All") {
      filter.status = req.query.status;
    }
    const orders = await PartyOrder.find(filter).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return next(err);
  }
};

// Admin: update status (Pending / Confirmed / Cancelled).
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const order = await PartyOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Request not found" });
    return res.json(order);
  } catch (err) {
    return next(err);
  }
};

// Admin: delete a request.
exports.remove = async (req, res, next) => {
  try {
    const order = await PartyOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Request not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
};

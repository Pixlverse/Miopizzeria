const Booking = require("../models/Booking");

// Public: create a reservation request.
exports.create = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    return res.status(201).json(booking);
  } catch (err) {
    return next(err);
  }
};

// Admin: list reservations, newest requests first. Optional ?status= filter.
exports.list = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== "All") {
      filter.status = req.query.status;
    }
    const bookings = await Booking.find(filter).sort({ date: 1, createdAt: -1 });
    return res.json(bookings);
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
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.json(booking);
  } catch (err) {
    return next(err);
  }
};

// Admin: delete a reservation.
exports.remove = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
};

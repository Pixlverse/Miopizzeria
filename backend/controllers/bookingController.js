const Booking = require("../models/Booking");
const { notifyNewBooking } = require("../services/notifications");
const {
  ALL_SLOTS,
  LUNCH_SLOTS,
  DINNER_SLOTS,
  BLOCKING_STATUSES,
  CLOSED_RESERVATION_DAYS,
  closedDaysLabel,
  isClosedDay,
  dayRange,
} = require("../config/reservations");

// Public: create a reservation request.
exports.create = async (req, res, next) => {
  try {
    const { date, time } = req.body;
    const { start, end } = dayRange(date);

    // One table per slot. Checked here rather than with a unique index because
    // a partial index can't express "any status except Cancelled".
    const taken = await Booking.exists({
      date: { $gte: start, $lt: end },
      time,
      status: { $in: BLOCKING_STATUSES },
    });
    if (taken) {
      return res.status(409).json({
        message: `Sorry, ${time} has just been taken. Please choose another time.`,
        code: "SLOT_TAKEN",
      });
    }

    const booking = await Booking.create(req.body);
    // Fire-and-forget: the guest shouldn't wait on WhatsApp or the mail server,
    // and an outage there must never fail a saved reservation.
    notifyNewBooking(booking);
    return res.status(201).json(booking);
  } catch (err) {
    return next(err);
  }
};

// Public: which slots are already gone for a given date, so the booking UI can
// disable them. Returns times only — never guest names or phone numbers.
exports.availability = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "date is required" });

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    if (isClosedDay(parsed)) {
      return res.json({
        date,
        closed: true,
        reason: `No reservations on ${closedDaysLabel()}.`,
        booked: ALL_SLOTS,
        slots: { lunch: LUNCH_SLOTS, dinner: DINNER_SLOTS },
      });
    }

    const { start, end } = dayRange(parsed);
    const rows = await Booking.find(
      { date: { $gte: start, $lt: end }, status: { $in: BLOCKING_STATUSES } },
      { time: 1, _id: 0 }
    ).lean();

    return res.json({
      date,
      closed: false,
      booked: [...new Set(rows.map((r) => r.time))],
      slots: { lunch: LUNCH_SLOTS, dinner: DINNER_SLOTS },
    });
  } catch (err) {
    return next(err);
  }
};

// Public: the rules the booking UI needs up front.
exports.rules = (req, res) =>
  res.json({
    closedDays: CLOSED_RESERVATION_DAYS,
    closedDaysLabel: closedDaysLabel(),
    slots: { lunch: LUNCH_SLOTS, dinner: DINNER_SLOTS },
  });

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

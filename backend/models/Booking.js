const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    date: { type: Date, required: true },
    time: { type: String, required: true, maxlength: 10 },
    guests: { type: Number, required: true, min: 1, max: 50 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);

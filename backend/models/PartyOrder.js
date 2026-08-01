const mongoose = require("mongoose");

const partyOrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    date: { type: String, trim: true, maxlength: 40 },
    guests: { type: Number, min: 1, max: 1000 },
    type: { type: String, trim: true, maxlength: 60 },
    message: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PartyOrder", partyOrderSchema);

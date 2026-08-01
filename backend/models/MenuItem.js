const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "", maxlength: 300 },
    imageUrl: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    bestSeller: { type: Boolean, default: false },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    archived: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);

const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
    category: {
      type: String,
      required: true,
      enum: ["Classic", "Gourmet", "Specialty", "Vegetarian"],
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, maxlength: 200 },
    imageUrl: { type: String, required: true },
    tags: [{ type: String, enum: ["Vegetarian", "Spicy", "New"] }],
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);

const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    // Arabic name/description, shown when the site is in Arabic (falls back to English).
    nameAr: { type: String, default: "", trim: true, maxlength: 120 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    // POS/product code from the master menu sheet (not unique — codes can repeat).
    productCode: { type: String, default: "", trim: true, maxlength: 40 },
    // Internal note from the menu sheet (e.g. "Add Redbull @ 15 QAR"). Not rendered publicly.
    remarks: { type: String, default: "", trim: true, maxlength: 200 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "", maxlength: 300 },
    descriptionAr: { type: String, default: "", maxlength: 400 },
    imageUrl: { type: String, default: "" },
    // Cloudinary public_id — kept so a replaced image can be destroyed.
    imagePublicId: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    bestSeller: { type: Boolean, default: false },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    archived: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);

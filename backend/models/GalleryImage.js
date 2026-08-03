const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    // Cloudinary public_id — kept so the asset can be destroyed when removed here.
    publicId: { type: String, default: "" },
    alt: { type: String, default: "", maxlength: 160 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryImage", galleryImageSchema);

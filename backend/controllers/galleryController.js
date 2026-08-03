const GalleryImage = require("../models/GalleryImage");
const { cloudinary, isConfigured } = require("../config/cloudinary");

exports.list = async (req, res, next) => {
  try {
    // Public callers see only active images; admins see everything.
    const filter = req.user ? {} : { status: "Active" };
    const images = await GalleryImage.find(filter).sort({ order: 1, createdAt: -1 });
    return res.json(images);
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    // New images land at the end of the grid unless an order was given.
    const order =
      req.body.order ?? (await GalleryImage.countDocuments());
    const image = await GalleryImage.create({ ...req.body, order });
    return res.status(201).json(image);
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!image) return res.status(404).json({ message: "Image not found" });
    return res.json(image);
  } catch (err) {
    return next(err);
  }
};

// Hard delete — the Cloudinary asset goes with it.
exports.remove = async (req, res, next) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    if (image.publicId && isConfigured()) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (err) {
        // The DB record is already gone; a stranded asset shouldn't fail the request.
        console.error("Cloudinary destroy failed for", image.publicId, err.message);
      }
    }
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
};

// Persists a new display order in one round trip: [{ id, order }, …]
exports.reorder = async (req, res, next) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    await Promise.all(
      items.map((it) => GalleryImage.findByIdAndUpdate(it.id, { order: it.order }))
    );
    const images = await GalleryImage.find().sort({ order: 1, createdAt: -1 });
    return res.json(images);
  } catch (err) {
    return next(err);
  }
};

const router = require("express").Router();
const auth = require("../middleware/auth");
const { cloudinary, isConfigured, cloudName, apiKey } = require("../config/cloudinary");

// Files never pass through this API: the admin UI asks for a short-lived signature
// here and then POSTs the file straight to Cloudinary. The API secret stays server-side.
const BASE_FOLDER = process.env.CLOUDINARY_FOLDER || "miopizzeria";
const ALLOWED_FOLDERS = ["menu", "gallery"];

router.get("/signature", auth, (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      message: "Image uploads are not configured. Set CLOUDINARY_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    });
  }

  const requested = String(req.query.folder || "menu");
  if (!ALLOWED_FOLDERS.includes(requested)) {
    return res.status(400).json({ message: `folder must be one of: ${ALLOWED_FOLDERS.join(", ")}` });
  }

  const folder = `${BASE_FOLDER}/${requested}`;
  const timestamp = Math.round(Date.now() / 1000);

  // Every param signed here must also be sent by the browser, and nothing else.
  const signature = cloudinary.utils.api_sign_request(
    { folder, timestamp },
    process.env.CLOUDINARY_API_SECRET
  );

  return res.json({ cloudName, apiKey, folder, timestamp, signature });
});

// Removes an asset from Cloudinary (called after an image is replaced or deleted).
router.delete("/", auth, async (req, res, next) => {
  const publicId = req.query.publicId;
  if (!publicId) return res.status(400).json({ message: "publicId is required" });
  if (!isConfigured()) return res.status(503).json({ message: "Image uploads are not configured." });

  // Only ever touch assets this app created.
  if (!String(publicId).startsWith(`${BASE_FOLDER}/`)) {
    return res.status(400).json({ message: "publicId is outside this app's folder" });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return res.json({ result: result.result });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

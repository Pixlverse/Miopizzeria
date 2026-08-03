const router = require("express").Router();
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const validate = require("../middleware/validate");
const { galleryImageSchema } = require("../validation/schemas");
const ctrl = require("../controllers/galleryController");

// Public read (optionalAuth lets admins also see inactive images).
router.get("/", optionalAuth, ctrl.list);

// Admin-only writes.
router.post("/", auth, validate(galleryImageSchema), ctrl.create);
router.patch("/reorder", auth, ctrl.reorder);
router.put("/:id", auth, validate(galleryImageSchema), ctrl.update);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;

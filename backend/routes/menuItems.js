const router = require("express").Router();
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const validate = require("../middleware/validate");
const { menuItemSchema } = require("../validation/schemas");
const ctrl = require("../controllers/menuController");

// Public reads (optionalAuth lets admins also see inactive items).
router.get("/", optionalAuth, ctrl.list);
router.get("/:id", ctrl.getOne);

// Admin-only writes.
router.post("/", auth, validate(menuItemSchema), ctrl.create);
router.put("/:id", auth, validate(menuItemSchema), ctrl.update);
router.patch("/:id/restore", auth, ctrl.restore);
router.delete("/:id", auth, ctrl.remove); // soft delete (archive)

module.exports = router;

const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { bookingSchema } = require("../validation/schemas");
const ctrl = require("../controllers/bookingController");

// Public: booking rules + which slots are gone on a date. Declared before the
// admin GET "/" so neither shadows the other.
router.get("/rules", ctrl.rules);
router.get("/availability", ctrl.availability);

// Public: guests submit a reservation request.
router.post("/", validate(bookingSchema), ctrl.create);

// Admin-only management.
router.get("/", auth, ctrl.list);
router.patch("/:id", auth, ctrl.updateStatus);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;

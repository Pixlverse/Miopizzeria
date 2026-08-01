const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { partyOrderSchema } = require("../validation/schemas");
const ctrl = require("../controllers/partyOrderController");

// Public: guests submit a party-order request.
router.post("/", validate(partyOrderSchema), ctrl.create);

// Admin-only management.
router.get("/", auth, ctrl.list);
router.patch("/:id", auth, ctrl.updateStatus);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;

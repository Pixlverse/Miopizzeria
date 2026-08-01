const router = require("express").Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { userCreateSchema } = require("../validation/schemas");
const ctrl = require("../controllers/userController");

// All admin-only.
router.get("/", auth, ctrl.list);
router.post("/", auth, validate(userCreateSchema), ctrl.create);
router.put("/:id/password", auth, ctrl.updatePassword);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;

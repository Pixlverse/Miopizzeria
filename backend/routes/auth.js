const router = require("express").Router();
const validate = require("../middleware/validate");
const { loginSchema } = require("../validation/schemas");
const ctrl = require("../controllers/authController");

router.post("/login", validate(loginSchema), ctrl.login);
router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);

module.exports = router;

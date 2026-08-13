const router = require("express").Router();
const auth = require("../middleware/auth");
const { PROVIDER, RECIPIENTS, FROM } = require("../services/mailer");
const { sendTestMessage } = require("../services/notifications");

// Admin: confirm the mail wiring without creating a fake booking.
router.post("/test", auth, async (req, res, next) => {
  try {
    const result = await sendTestMessage();
    return res.json({ provider: PROVIDER, from: FROM, recipients: RECIPIENTS, result });
  } catch (err) {
    return next(err);
  }
});

// Admin: what the notifier is currently configured to do.
router.get("/status", auth, (req, res) =>
  res.json({ provider: PROVIDER, from: FROM, recipients: RECIPIENTS })
);

module.exports = router;

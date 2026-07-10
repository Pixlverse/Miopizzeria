const router = require("express").Router();
const auth = require("../middleware/auth");
const Settings = require("../models/Settings");

// There is a single settings document; create a default if none exists.
router.get("/", async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

router.put("/", auth, async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const router = require("express").Router();
const auth = require("../middleware/auth");
const Category = require("../models/Category");

router.get("/", async (req, res, next) => {
  try {
    res.json(await Category.find().sort({ order: 1 }));
  } catch (err) {
    next(err);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    res.status(201).json(await Category.create({ name: req.body.name, order: req.body.order || 0 }));
  } catch (err) {
    next(err);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

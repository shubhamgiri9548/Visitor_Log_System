const express = require("express");
const Visitor = require("../models/visitors");
const router = express.Router();


// Add new visitor
router.post("/", async (req, res) => {
  try {
    const visitor = new Visitor(req.body);
    const savedVisitor = await visitor.save();
    res.json(savedVisitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get visitors (optionally filter by date)
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) query.date = date;

    const visitors = await Visitor.find(query).sort({ checkIn: -1 });
    
    if (visitors.length === 0) {
      return res.status(404).json({ message: "No data found for this date" });
    }

    res.json(visitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update checkout time
router.put("/:id/checkout", async (req, res) => {
  try {
    const updated = await Visitor.findByIdAndUpdate(
      req.params.id,
      { checkOut: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

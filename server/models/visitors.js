const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  name: String,
  address: String,
  mobile: String,
  purpose: String,
  reference: String,
  checkIn: { type: Date, default: Date.now },
  checkOut: { type: Date },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

module.exports = mongoose.model("Visitor", visitorSchema);

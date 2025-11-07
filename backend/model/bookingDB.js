// model/bookingDB.js
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["BUSY", "SWAPPABLE", "SWAP_PENDING"],
    default: "SWAPPABLE",
  },
});

module.exports = mongoose.model("Booking", BookingSchema);

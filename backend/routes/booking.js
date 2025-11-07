const express = require("express");
const Booking = require("../model/bookingDB.js");
const { verifyToken } = require("../middleware/authmiddleware.js");

const router = express.Router();

// ✅ Create new booking (Protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    const userId = req.user._id; // from token

    const booking = new Booking({ title, startTime, endTime, userId });
    await booking.save();

    console.log("📥 Booking request received:", req.body);

    res.json({ success: true, message: "Event added successfully", booking });
  } catch (err) {
    console.error("❌ Error adding booking:", err);
    res.status(500).json({ success: false, message: "Error adding booking" });
  }
});

// ✅ Get all bookings of logged-in user (Protected)
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ userId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ✅ Update a booking (Protected)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId }, // only update own bookings
      req.body,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error updating booking" });
  }
});

// ✅ Delete a booking (Protected)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting booking" });
  }
});

module.exports = router;

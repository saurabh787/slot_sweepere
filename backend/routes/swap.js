const express = require("express");
const router = express.Router();
const Booking = require("../model/bookingDB");
const SwapRequest = require("../model/swaprequest");
const { verifyToken } = require("../middleware/authmiddleware");
const User = require("../model/user"); // ✅ ensure User model is registered



// GET /api/swappable-slots
router.get("/swappable-slots", verifyToken, async (req, res) => {
  try {
    console.log("🟢 Fetching swappable slots for user:", req.user._id);

    const slots = await Booking.find({
      status: "SWAPPABLE",
      userId: { $ne: req.user._id }
    }).populate("userId", "name email");

    console.log("✅ Found slots:", slots);
    res.json(slots);
  } catch (err) {
    console.error("❌ Error fetching swappable slots:", err.message);
    res.status(500).json({ message: err.message });
  }
});



//  POST /api/swap-request

router.post("/swap-request", verifyToken, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    const requesterId = req.user._id;

    // Verify both slots exist
    const mySlot = await Booking.findById(mySlotId);
    const theirSlot = await Booking.findById(theirSlotId);

    if (!mySlot || !theirSlot)
      return res.status(404).json({ message: "Slot not found" });

    // Ensure both are SWAPPABLE
    if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE") {
      return res
        .status(400)
        .json({ message: "Both slots must be available for swap" });
    }

    // Prevent swapping with your own slot
    if (theirSlot.userId.toString() === requesterId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot request a swap with your own slot" });
    }

    // Create Swap Request
    const swapRequest = new SwapRequest({
      requesterId,
      receiverId: theirSlot.userId,
      mySlotId,
      theirSlotId,
    });

    await swapRequest.save();

    // Update both slot statuses to SWAP_PENDING
    mySlot.status = "SWAP_PENDING";
    theirSlot.status = "SWAP_PENDING";
    await mySlot.save();
    await theirSlot.save();

    console.log("🔁 Swap request created:", swapRequest._id);
    res.json({ success: true, swapRequest });
  } catch (err) {
    console.error(" Error creating swap request:", err);
    res.status(500).json({ message: "Server error creating swap request" });
  }
});


//  POST /api/swap-response/:requestId

router.post("/swap-response/:requestId", verifyToken, async (req, res) => {
  try {
    const { accepted } = req.body;
    const requestId = req.params.requestId;
    const userId = req.user._id;

    const swapRequest = await SwapRequest.findById(requestId)
      .populate("mySlotId")
      .populate("theirSlotId");

    if (!swapRequest)
      return res.status(404).json({ message: "Swap request not found" });

    // Only receiver can respond
    if (swapRequest.receiverId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to respond" });
    }

    const mySlot = await Booking.findById(swapRequest.mySlotId._id);
    const theirSlot = await Booking.findById(swapRequest.theirSlotId._id);

    if (accepted) {
      // ACCEPTED: swap ownership
      const tempOwner = mySlot.userId;
      mySlot.userId = theirSlot.userId;
      theirSlot.userId = tempOwner;

      mySlot.status = "BUSY";
      theirSlot.status = "BUSY";
      swapRequest.status = "ACCEPTED";

      await mySlot.save();
      await theirSlot.save();
      await swapRequest.save();

      console.log(`✅ Swap accepted: ${swapRequest._id}`);
      return res.json({ message: "Swap accepted successfully" });
    } else {
      // REJECTED: revert statuses
      mySlot.status = "SWAPPABLE";
      theirSlot.status = "SWAPPABLE";
      swapRequest.status = "REJECTED";

      await mySlot.save();
      await theirSlot.save();
      await swapRequest.save();

      console.log(` Swap rejected: ${swapRequest._id}`);
      return res.json({ message: "Swap rejected" });
    }
  } catch (err) {
    console.error(" Error responding to swap:", err);
    res.status(500).json({ message: "Server error responding to swap" });
  }
});

// ✅ Get incoming swap requests for the logged-in user
router.get("/incoming", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await SwapRequest.find({ receiverId: userId })
      .populate("requesterId", "name email")
      .populate("mySlotId")
      .populate("theirSlotId")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching incoming requests:", err);
    res.status(500).json({ message: "Server error fetching incoming requests" });
  }
});


module.exports = router;

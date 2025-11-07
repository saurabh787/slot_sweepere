import React, { useState, useEffect } from "react";
import axios from "axios";
import MyCalendar from "../component/calender";
import AddEventModal from "../component/slot_form";
import Navbar from "../component/navbar";
import BookedSlotsList from "../component/bookedslotlist";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleSelectSlot = (slotInfo) => {
    const date = slotInfo.start.toISOString().split("T")[0];
    setSelectedDate(date);
    setShowModal(true);
  };

  // ✅ Only this makes the booking
  const saveEvent = async (eventData) => {
    try {
      const token = localStorage.getItem("token");
      console.log("🟢 Saving booking:", eventData);

      await axios.post("http://localhost:5000/api/bookings", eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRefreshTrigger((prev) => !prev); // ✅ auto-refresh UI
      console.log("🔄 Refreshed bookings");
    } catch (err) {
      console.error("❌ Save Error:", err);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <MyCalendar onSelectSlot={handleSelectSlot} />

      <AddEventModal
        show={showModal}
        onHide={() => setShowModal(false)}
        date={selectedDate}
        onSave={saveEvent} // ✅ only triggers dashboard save
      />

      <BookedSlotsList refreshTrigger={refreshTrigger} />
    </>
  );
}

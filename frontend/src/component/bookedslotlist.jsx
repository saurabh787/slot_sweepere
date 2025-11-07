import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Button, Modal, Form } from "react-bootstrap";

export default function BookedSlotsList({ refreshTrigger }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSlot, setEditSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch from backend
  const fetchSlots = async () => {
    try {
      console.log("📡 Fetching bookings from backend...");
      const token = localStorage.getItem("token");
      const res = await axios.get("https://slot-sweepere.vercel.app/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Received slots:", res.data);
      setSlots(res.data);
    } catch (err) {
      console.error("❌ Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-fetch when refreshTrigger changes
  useEffect(() => {
    console.log("⚡ useEffect triggered — refreshTrigger:", refreshTrigger);
    fetchSlots();
  }, [refreshTrigger]);

  // ✅ Delete slot
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://slot-sweepere.vercel.app/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🗑️ Slot deleted:", id);
      setSlots((prev) => prev.filter((s) => s._id !== id)); // update instantly
    } catch (err) {
      console.error("❌ Error deleting slot:", err);
      alert("Failed to delete slot.");
    }
  };

  // ✅ Update slot
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://slot-sweepere.vercel.app/api/bookings/${editSlot._id}`,
        editSlot,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✏️ Slot updated:", res.data);

      setSlots((prev) =>
        prev.map((s) => (s._id === editSlot._id ? res.data : s))
      ); // update instantly

      setShowModal(false);
      setEditSlot(null);
    } catch (err) {
      console.error("❌ Error updating slot:", err);
      alert("Failed to update slot.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-3">
        <Spinner animation="border" variant="primary" /> Loading...
      </div>
    );

  return (
    <div className="container mt-4">
      <h4 className="fw-bold mb-3">📋 Your Booked Slots</h4>

      {slots.length === 0 ? (
        <div className="alert alert-info">No slots booked yet.</div>
      ) : (
        <div className="row">
          {slots.map((slot, idx) => (
            <div key={slot._id} className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{slot.title}</h5>
                  <p>
                    <b>Start:</b>{" "}
                    {new Date(slot.startTime).toLocaleString()}
                    <br />
                    <b>End:</b> {new Date(slot.endTime).toLocaleString()}
                  </p>

                  <div className="d-flex justify-content-between">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setEditSlot(slot);
                        setShowModal(true);
                      }}
                    >
                      ✏️ Update
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(slot._id)}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✏️ Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editSlot && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={editSlot.title}
                  onChange={(e) =>
                    setEditSlot({ ...editSlot, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={new Date(editSlot.startTime)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    setEditSlot({ ...editSlot, startTime: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={new Date(editSlot.endTime)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    setEditSlot({ ...editSlot, endTime: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

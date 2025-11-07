import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Card, Row, Col } from "react-bootstrap";

export default function Marketplace() {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedTheirSlot, setSelectedTheirSlot] = useState(null);
  const [selectedMySlot, setSelectedMySlot] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch swappable slots from other users
  const fetchSwappableSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/swappable-slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSwappableSlots(res.data);
    } catch (err) {
      console.error("❌ Error fetching swappable slots:", err);
    }
  };

  // ✅ Fetch my own swappable slots
  const fetchMySlots = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Only swappable slots
      const mine = res.data.filter((s) => s.status === "SWAPPABLE");
      setMySlots(mine);
    } catch (err) {
      console.error("❌ Error fetching my slots:", err);
    }
  };

  // ✅ Open modal and fetch my slots
  const handleRequestSwap = (theirSlot) => {
    setSelectedTheirSlot(theirSlot);
    fetchMySlots();
    setShowModal(true);
  };

  // ✅ Confirm swap request
  const confirmSwap = async () => {
    if (!selectedMySlot) {
      alert("Please select one of your slots to swap!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/swap-request",
        {
          mySlotId: selectedMySlot,
          theirSlotId: selectedTheirSlot._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Swap request sent successfully!");
      setShowModal(false);
      fetchSwappableSlots(); // Refresh list
    } catch (err) {
      console.error("❌ Error sending swap request:", err);
      alert(err.response?.data?.message || "Error sending request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwappableSlots();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">🌐 Marketplace – Available Swaps</h3>

      {swappableSlots.length === 0 ? (
        <p>No swappable slots available right now.</p>
      ) : (
        <Row>
          {swappableSlots.map((slot) => (
            <Col md={4} key={slot._id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{slot.title}</Card.Title>
                  <Card.Text>
                    <strong>Start:</strong> {new Date(slot.startTime).toLocaleString()}
                    <br />
                    <strong>End:</strong> {new Date(slot.endTime).toLocaleString()}
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleRequestSwap(slot)}>
                    Request Swap
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for selecting user's own slot */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Slot Swap</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You're requesting to swap with:{" "}
            <strong>{selectedTheirSlot?.title}</strong>
          </p>

          <Form.Group>
            <Form.Label>Select one of your swappable slots:</Form.Label>
            <Form.Select
              value={selectedMySlot}
              onChange={(e) => setSelectedMySlot(e.target.value)}
            >
              <option value="">-- Choose your slot --</option>
              {mySlots.map((slot) => (
                <option key={slot._id} value={slot._id}>
                  {slot.title} ({new Date(slot.startTime).toLocaleTimeString()} -{" "}
                  {new Date(slot.endTime).toLocaleTimeString()})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmSwap} disabled={loading}>
            {loading ? "Sending..." : "Send Request"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";

export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncomingRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://slot-sweepere.vercel.app/api/incoming", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("❌ Error fetching incoming requests:", err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, accepted) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://slot-sweepere.vercel.app/api/swap-response/${requestId}`,
        { accepted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(accepted ? "Swap Accepted ✅" : "Swap Rejected ❌");
      fetchIncomingRequests(); // refresh
    } catch (err) {
      console.error("❌ Error responding:", err);
      alert(err.response?.data?.message || "Error responding to swap");
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  if (loading) return <div className="text-center mt-4"><Spinner animation="border" /></div>;

  return (
    <div className="container mt-4">
      <h3>📨 Incoming Swap Requests</h3>
      {requests.length === 0 ? (
        <p>No incoming swap requests yet.</p>
      ) : (
        <Row>
          {requests.map((req) => (
            <Col md={6} key={req._id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    Request from <strong>{req.requesterId?.name || "Unknown"}</strong>
                  </Card.Title>
                  <Card.Text>
                    <strong>Their Slot:</strong> {req.theirSlotId?.title} <br />
                    <strong>→ Wants to swap with your slot:</strong> {req.mySlotId?.title}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="success"
                      onClick={() => handleResponse(req._id, true)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleResponse(req._id, false)}
                    >
                      Reject
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

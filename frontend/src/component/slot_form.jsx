import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";

export default function AddEventModal({ show, onHide, date, onSave }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("loggedInUser");

    if (!token || !user) {
      alert("You must be logged in to add a slot!");
      return;
    }

    const data = {
      title,
      startTime: `${date}T${start}`,
      endTime: `${date}T${end}`,
    };

    // ✅ Call parent function (which does the API + refresh)
    onSave(data);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <h5>Add Slot</h5>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

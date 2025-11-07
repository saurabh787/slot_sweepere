// AppNavbar.jsx
import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AppNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          SlotSwapper
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto gap-3 align-items-center">
            <Nav.Link onClick={() => navigate("/home")}>Dashboard</Nav.Link>
            <Nav.Link onClick={() => navigate("/marketplace")}>Marketplace</Nav.Link>
            <Nav.Link onClick={() => navigate("/request")}>Request</Nav.Link>

            {!token && (
              <Button
                variant="outline-light"
                className="ms-2"
                onClick={() => navigate("/login")}
              >
                Login / Signup
              </Button>
            )}

            {token && (
              <Button
                variant="outline-light"
                className="ms-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

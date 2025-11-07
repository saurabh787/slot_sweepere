// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/navbar";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Marketplace from "./pages/marketplace"; // ✅ added
import Request from "./pages/request";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Navbar />
      <Routes>
        {/* Default route shows dashboard if logged in */}
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Login & Signup pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Marketplace page */}
        <Route
          path="/marketplace"
          element={token ? <Marketplace /> : <Navigate to="/login" />}
        />

        {/* Home route (optional alias for dashboard) */}
        <Route
          path="/home"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/request"
          element={token ? <Request /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;

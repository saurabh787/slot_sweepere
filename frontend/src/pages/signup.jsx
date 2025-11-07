import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return handleError("All fields are required");
    }

    try {
      const url = "https://slot-sweepere.vercel.app/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError("Something went wrong, try again later.");
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "420px", borderRadius: "20px" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Create Account</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">
              Full Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              className="form-control p-2"
              placeholder="Enter your name"
              value={signupInfo.name}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              className="form-control p-2"
              placeholder="Enter your email"
              value={signupInfo.email}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              className="form-control p-2"
              placeholder="Enter your password"
              value={signupInfo.password}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold"
            style={{ borderRadius: "10px" }}
          >
            Sign Up
          </button>

          <p className="text-center mt-3 mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none text-primary fw-semibold">
              Login
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;

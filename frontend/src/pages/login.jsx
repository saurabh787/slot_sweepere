import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) return handleError('Email and password are required');

    try {
      const url = `https://slot-sweepere.vercel.app/auth/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        setTimeout(() => navigate('/home'), 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || 'Login failed');
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              value={loginInfo.email}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              id="password"
              value={loginInfo.password}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
        </form>
        <p className="text-center mb-0">
          Don't have an account?{' '}
          <Link to="/signup" className="text-decoration-none">Signup</Link>
        </p>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default Login;

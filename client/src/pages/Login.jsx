import { useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    otp: '',
    role: '',
  });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email: form.email,
        password: form.password,
        otp: form.otp,
        role: form.role,
      });

      const { user, token } = res.data;

      // Check if role & email & otp match the inputs
      if (
        user.email === form.email &&
        user.role === form.role.toUpperCase() && // match enum
        (!user.otp || user.otp === form.otp)
      ) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        alert('Role, Email, or OTP mismatch.');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          name="otp"
          type="text"
          onChange={handleChange}
          placeholder="OTP (if any)"
          className="w-full p-2 mb-2 border rounded"
        />
        <select
          name="role"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select Role</option>
          <option value="SUPERADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
          <option value="CLIENT">Client</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          By logging in, you agree to our{' '}
          <a href="/terms" className="text-blue-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-500">
            Privacy Policy
          </a>.
        </p>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

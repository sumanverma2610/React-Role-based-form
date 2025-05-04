import { useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'


const roles = ['SUPERADMIN', 'ADMIN', 'STAFF', 'CLIENT'];

export default function Register() {

    const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    otp: '',           
    role: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', form);
      alert('Registered successfully');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input type="text" name="name" onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
        <input type="email" name="email" onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
        <input type="text" name="phone" onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
        <input type="text" name="otp" onChange={handleChange} placeholder="OTP" className="w-full p-2 border rounded" /> {/* ✅ Added OTP input */}
        <input type="password" name="password" onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" />
        <select name="role" onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Select Role</option>
          <option value="SUPERADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
          <option value="CLIENT">Client</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
        <p className='text-center text-sm text-gray-500'>By registering, you agree to our <a href="/terms" className="text-blue-500">Terms of Service</a> and <a href="/privacy" className="text-blue-500">Privacy Policy</a>.</p>
        <p className="text-center text-sm text-gray-500">Already have an account?   <Link to="/login" className="text-blue-500 underline">
       Login
      </Link></p>  
       
      </form>
    </div>
  );
}

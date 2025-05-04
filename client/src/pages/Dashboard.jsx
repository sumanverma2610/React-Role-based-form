import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:5000/api/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setUser(res.data.user);
    })
    .catch((err) => {
      console.error(err);
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      navigate('/login');
    });
  }, [navigate]);

  if (!user) {
    return <div className="text-center mt-10 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        <button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

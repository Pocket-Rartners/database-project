import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { User } from './interfaces'; // Adjust the path according to your project structure

function Login({ setLogIn }) {
  const [id, setId] = useState(''); // Ensure id is being used
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        userName, // Send userName for authentication
        password, // Send password for authentication
      });

      const userInfo = response.data.user; 
      console.log("The user info is "+JSON.stringify(userInfo, null, 2))
      if (userInfo) {
        // Prepare the updated user object from the response
        const updatedUser: User = {
          id: userInfo.id,
          userName: userInfo.userName, // Assuming userName comes back in the response
          carousels: userInfo.carousels || [], // Use the returned carousels
          activeCarousel: userInfo.activeCarousel || null, // Set activeCarousel from the response
        };
        
        handleLogin(updatedUser);
      } else {
        setError('Invalid login response.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleLogin = (userInfo) => {
    setLogIn(userInfo);
    navigate('/home');
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="userName"
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Login
          </button>
          <Link to="/signup" className="text-blue-500 hover:text-blue-700">
            Don't have an account? Sign Up
          </Link>
        </div>
      </form>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}

export default Login;

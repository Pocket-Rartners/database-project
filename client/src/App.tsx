import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login.tsx';
import Signup from './Signup.tsx';
import Home from './Home.tsx';
import Config from './config/page.tsx';
import { User, Carousel } from './interfaces.tsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userInfo: User) => {
    setIsLoggedIn(true);

    // Create a new user object with carousels and set activeCarousel
    const userWithCarousels: User = {
      id: userInfo.id,
      userName: userInfo.userName,
      carousels: userInfo.carousels ? userInfo.carousels.map((carousel: Carousel) => ({
        id: carousel.id,
        title: carousel.title,
        slides: carousel.slides,
        createdAt: carousel.createdAt,
        active: carousel.active,
      })) : [], // Initialize to an empty array if there are no carousels
      activeCarousel: userInfo.carousels?.find((carousel: Carousel) => carousel.active) || null,
    };

    setUser(userWithCarousels);
    console.log("The user is "+ JSON.stringify(userWithCarousels)); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isLoggedIn ? <Home user={user} handleLogout={handleLogout} /> : <Login setLogIn={handleLogin} />} 
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={isLoggedIn ? <Home user={user} handleLogout={handleLogout} /> : <Login setLogIn={handleLogin} />} />
        <Route path="/config/new" element={<Config carousels={[]} user={user} setUser={setUser}/>} />
        <Route path="/config/:id" element={<Config carousels={user?.carousels} user={user} setUser={setUser}/>} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components for each branch
import Questions from './components/Questions/Questions';
import UserDashboard from './components/UserDashboard/UserDashboard';
import Chatbot from './components/Chatbot/Chatbot';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Navbar from './components/Layout/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      // This is a placeholder - implement actual token verification
      setIsAuthenticated(true);
      // Fetch user data
      // fetchUserData();
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/questions" /> : <Register setIsAuthenticated={setIsAuthenticated} />} 
          />
          
          {/* Protected routes */}
          <Route 
            path="/questions" 
            element={isAuthenticated ? <Questions setUserData={setUserData} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <UserDashboard userData={userData} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/chatbot" 
            element={isAuthenticated ? <Chatbot userData={userData} /> : <Navigate to="/login" />} 
          />
          
          {/* Default route */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
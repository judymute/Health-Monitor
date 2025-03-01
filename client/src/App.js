import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import the three main components
import Questions from './Questions';
import UserDashboard from './UserDashboard';
import Chatbot from './Chatbot';

function App() {
  const [userData, setUserData] = useState(null);

  return (
    <Router>
      <div className="App">
        <nav style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
            <li><Link to="/questions">Health Questions</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/chatbot">Health Assistant</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/questions" element={<Questions setUserData={setUserData} />} />
          <Route path="/dashboard" element={<UserDashboard userData={userData} />} />
          <Route path="/chatbot" element={<Chatbot userData={userData} />} />
          <Route path="/" element={<Questions setUserData={setUserData} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
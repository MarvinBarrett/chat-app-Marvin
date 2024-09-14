import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import SideNav from './components/SideNav';
import ProtectedRoute from './components/ProtectedRoute';
import FirstPage from './components/FirstPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeSession = () => {
      const token = sessionStorage.getItem('token');
      const userId = sessionStorage.getItem('userId');
      const username = sessionStorage.getItem('username');
      const avatar = sessionStorage.getItem('avatar');

      
      if (token && userId && username) {
        setUser({ id: userId, username: username, avatar: avatar });
      }
    };

    initializeSession();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        {user && <SideNav user={user} handleLogout={handleLogout} />}
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<FirstPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route
                path="/chat"
                element={
                  <ProtectedRoute user={user}>
                    <Chat user={user} setUser={setUser} />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/chat" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
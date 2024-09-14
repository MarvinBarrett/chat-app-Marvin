import React, { useState } from 'react';
import '../styles/SideNav.css';

const SideNav = ({ user, handleLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const avatarUrl = user.avatar || `https://i.pravatar.cc/200?u=${user.id}`;

  return (
    <div className={`side-nav ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {collapsed ? '>' : '<'}
      </button>
      <div className="user-info">
        <img src={avatarUrl} alt={`${user.username}'s Avatar`} className="user-avatar" />
        <span className="user-name">{user.username}</span>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default SideNav;


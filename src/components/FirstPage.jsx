import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FirstPage.css'

const FirstPage = () => {
  return (
    <div className="firstpage-container">
      <h1>Welcome</h1>
     
      <p>Please choose an option to continue:</p>
      <div className="options">
        <Link to="/register">
          <button>Register</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default FirstPage;

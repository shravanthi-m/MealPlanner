// ...existing code...
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <Link to="/" className="brand">Meal Planner</Link>
          <nav className="nav">
            <Link to="/login" className="login">Login</Link>
            <Link to="/register" className="register">Register</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        © 2025 Meal Planner. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
// ...existing code...
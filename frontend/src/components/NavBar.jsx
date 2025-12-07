// NavBar.js
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getStoreValue, setStoreValue } from "pulsy";
import { logout } from "../services/auth.service";

import "./NavBar.css";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // read user from localStorage if present (try multiple keys)
    try {
      let u = null;
      const store = getStoreValue('auth');
      const info = store.user;
      if (info) {
        u = info.username;
      } else if (store.username) {
        u = { username: store.username };
      } else if (store.email) {
        u = { email: store.email };
      }
      setUser(u);
    } catch (e) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = () => {
    logout()
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  const handleSwitchUser = () => {
    const name = window.prompt("Enter display name for user (for dev/demo):", user?.name || "");
    if (name !== null) {
      const store = getStoreValue('auth');
      const newUser = { username: name.trim() || "Guest" };
      setStoreValue('auth', { token: store.token, user: newUser });
      setUser(newUser);
      setMenuOpen(false);
    }
  };

  const displayName = user?.username || user?.name || user?.email || (typeof user === 'string' ? user : null) || null;
  const initials = displayName ? displayName.split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase() : "G";

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="brand" onClick={() => navigate("/")}>MealPlanner</div>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/add-food" className={({isActive}) => isActive ? 'active' : ''}>Add Food</NavLink></li>
        <li><NavLink to="/search-food" className={({isActive}) => isActive ? 'active' : ''}>Search Foods</NavLink></li>
        <li><NavLink to="/meal-plan" className={({isActive}) => isActive ? 'active' : ''}>Weekly Meal Plan</NavLink></li>
        <li><NavLink to="/shopping-list" className={({isActive}) => isActive ? 'active' : ''}>Shopping List</NavLink></li>
      </ul>

      <div className="nav-right" ref={menuRef}>
          <button className="user-btn" onClick={() => setMenuOpen(s => !s)} aria-haspopup="true" aria-expanded={menuOpen}>
          <span className="avatar">{initials}</span>
          <span className="username">{displayName || 'Not signed in'}</span>
          <span className="chev">▾</span>
        </button>
        {menuOpen && (
          <div className="user-menu">
            <button onClick={handleSwitchUser} className="menu-item">Switch User</button>
            <button onClick={handleLogout} className="menu-item danger">Log out</button>
          </div>
        )}
      </div>
    </nav>
  );
}

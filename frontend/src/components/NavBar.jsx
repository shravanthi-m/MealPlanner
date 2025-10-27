// NavBar.js
import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/add-food">Add Food</Link></li>
        <li><Link to="/meal-plan">Weekly Meal Plan</Link></li>
        <li><Link to="/shopping-list">Shopping List</Link></li>
      </ul>
    </nav>
  );
}

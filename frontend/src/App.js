// Entry point for the app
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MealPlanPage from "./pages/MealPlanPage";
import ShoppingListPage from "./pages/ShoppingListPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/meal-plan" element={<MealPlanPage />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />
        <Route path="/" element={<MealPlanPage />} />
      </Routes>
    </Router>
  );
}

export default App;

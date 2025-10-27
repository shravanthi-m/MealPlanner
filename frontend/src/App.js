// Entry point for the app
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MealPlanPage from "./pages/MealPlanPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import AddFoodPage from "./pages/AddFoodPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/meal-plan" element={<MealPlanPage />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />
        <Route path="/add-food" element={<AddFoodPage />} />
        <Route path="/" element={<MealPlanPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MealPlanPage from "./pages/MealPlanPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import AddFoodPage from "./pages/AddFoodPage";
import SearchFoodPage from "./pages/SearchFoodPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/meal-plan" element={<MealPlanPage />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />
        <Route path="/add-food" element={<AddFoodPage />} />
        <Route path="/search-food" element={<SearchFoodPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

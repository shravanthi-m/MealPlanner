import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./AddFoodPage.css";

const emptyIngredient = { name: "", quantity: "", unit: "" };

export default function AddFoodPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState([{ ...emptyIngredient }]);
  const [message, setMessage] = useState("");

  const handleIngredientChange = (idx, field, value) => {
    const updated = ingredients.map((ing, i) =>
      i === idx ? { ...ing, [field]: value } : ing
    );
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ...emptyIngredient }]);
  };

  const removeIngredient = (idx) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await apiFetch("/api/food", {
        method: "POST",
        body: JSON.stringify({ name, category, ingredients }),
      });
      setMessage("Food added successfully!");
      setName("");
      setCategory("");
      setIngredients([{ ...emptyIngredient }]);
    } catch (err) {
      setMessage(err.message || "Error adding food");
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <div className="add-food-page">
        <div className="add-food-card">
          <div className="add-food-header">
            <h2>Create Recipe</h2>
            <p className="lead">Add ingredients and details for your meal plan</p>
          </div>

          <form className="add-food-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="food-name">Name</label>
              <input
                id="food-name"
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="e.g., Grilled Chicken Salad"
              />
            </div>

            <div className="field">
              <label htmlFor="food-category">Category</label>
              <input
                id="food-category"
                className="input"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g., Lunch, Dinner, Snacks, etc."
              />
            </div>

            <div className="field">
              <label>Ingredients & Quantities</label>
              <div className="ingredients-list">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="ingredient-row">
                    <input
                      className="input"
                      placeholder="Ingredient"
                      value={ing.name}
                      onChange={e => handleIngredientChange(idx, "name", e.target.value)}
                      required
                    />
                    <input
                      className="number-input"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Qty"
                      value={ing.quantity}
                      onChange={e => handleIngredientChange(idx, "quantity", e.target.value)}
                      required
                    />
                    <input
                      className="input"
                      placeholder="Unit"
                      value={ing.unit}
                      onChange={e => handleIngredientChange(idx, "unit", e.target.value)}
                    />
                    <button
                      type="button"
                      className="small-btn"
                      onClick={() => removeIngredient(idx)}
                      disabled={ingredients.length === 1}
                      aria-label={`Remove ingredient ${idx + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="row-actions">
                <button type="button" className="btn-ghost" onClick={addIngredient}>
                  <span style={{ marginRight: "4px" }}>+</span> Add Ingredient
                </button>
              </div>
            </div>

            <div className="row-actions">
              <button type="submit" className="btn-primary">Save Recipe</button>
            </div>
          </form>

          {message && (
            <div className={`message ${message.toLowerCase().includes("success") ? "success" : "error"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

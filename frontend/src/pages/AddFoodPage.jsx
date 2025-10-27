import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

const emptyIngredient = { name: "", quantity: 1, unit: "" };

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
      <div style={{ maxWidth: 500, margin: "2rem auto" }}>
        <h2>Add Food</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label>Category:</label>
            <input value={category} onChange={e => setCategory(e.target.value)} />
          </div>
          <div>
            <label>Ingredients:</label>
            {ingredients.map((ing, idx) => (
              <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: 4 }}>
                <input
                  placeholder="Name"
                  value={ing.name}
                  onChange={e => handleIngredientChange(idx, "name", e.target.value)}
                  required
                />
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Quantity"
                  value={ing.quantity}
                  onChange={e => handleIngredientChange(idx, "quantity", e.target.value)}
                  required
                />
                <input
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={e => handleIngredientChange(idx, "unit", e.target.value)}
                />
                <button type="button" onClick={() => removeIngredient(idx)} disabled={ingredients.length === 1}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addIngredient}>Add Ingredient</button>
          </div>
          <button type="submit" style={{ marginTop: "1rem" }}>Add Food</button>
        </form>
        {message && <div style={{ marginTop: "1rem", color: message.includes("success") ? "green" : "red" }}>{message}</div>}
      </div>
    </>
  );
}

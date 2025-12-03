import { useState } from "react";
import NavBar from "../components/NavBar";
import { apiFetch } from "../utils/api";

export default function SearchFoodPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const resp = await apiFetch("/api/food/search", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      console.log(resp);
      setMessage("Food added successfully!");
      setName("");
    } catch (err) {
      setMessage(err.message || "Error adding food");
    }
  };

  return (
    <>
      <NavBar />
      <div className="add-food-page">
        <div className="add-food-card">
          <div className="add-food-header">
            <h2>Search for Ingredient</h2>
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

            <div className="row-actions">
              <button type="submit" className="btn-primary">Search for Ingredient</button>
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

import { useState } from "react";
import NavBar from "../components/NavBar";
import { apiFetch } from "../utils/api";

/**
 * Creates a nutrition info table
 * @param {Object} nutrition
 * @param {Object} nutrition.Calories
 * @param {string | number} nutrition.Calories.quantity
 * @param {string} nutrition.Calories.unit
 * @param {Object} nutrition.Carbs
 * @param {string | number} nutrition.Carbs.quantity
 * @param {string} nutrition.Carbs.unit
 * @param {Object} nutrition.Fat
 * @param {string | number} nutrition.Fat.quantity
 * @param {string} nutrition.Fat.unit
 * @param {Object} nutrition.Protein
 * @param {string | number} nutrition.Protein.quantity
 * @param {string} nutrition.Protein.unit
 * @param {string | number} nutrition.quantity
 * @param {string} nutrition.unit
 * @returns 
 */
function NutritionInfo({ nutrition }) {
  return (
    <div className="nutrition-info">
        <table>
            <tr>
                <td>Serving</td><td>{`${nutrition.quantity}${nutrition.unit}`}</td>
            </tr>
            <tr> 
                <td>Calories</td><td>{`${nutrition.Calories.quantity}${nutrition.Calories.unit}`}</td>
            </tr>
            <tr>
                <td>Carbs</td><td>{`${nutrition.Carbs.quantity}${nutrition.Carbs.unit}`}</td>
            </tr>
            <tr>
                <td>Fat</td><td>{`${nutrition.Fat.quantity}${nutrition.Fat.unit}`}</td>
            </tr>
            <tr>
                <td>Protein</td><td>{`${nutrition.Protein.quantity}${nutrition.Protein.unit}`}</td>
            </tr>
        </table> 
    </div>
  );
}

export default function SearchFoodPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // API call to search food by name 
      // with response object: {name, category, nutrition_information}
      // nutrition information object is used in nutrition label
      const resp = await apiFetch("/api/food/search", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
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
            <p className="lead">Add ingredients and details for your recipes</p>
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

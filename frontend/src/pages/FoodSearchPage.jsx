import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { apiFetch } from "../utils/api";
import "./FoodSearchPage.css";

export default function FoodSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // Track if search was performed
  
  // Modal state for adding ingredients
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setMessage("");
    setHasSearched(true); // Mark that a search has been performed

    try {
      const data = await apiFetch(`/api/food/search?query=${encodeURIComponent(query)}`);
      setResults(data.api || []);
    } catch (err) {
      setError(err.message || "Failed to search foods");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (food) => {
    setSelectedFood(food);
    // Pre-populate ingredients from Spoonacular if available
    if (food.ingredients && food.ingredients.length > 0) {
      setIngredients(food.ingredients.map(ing => ({
        name: ing.name || '',
        quantity: ing.quantity?.toString() || '',
        unit: ing.unit || ''
      })));
    } else {
      setIngredients([{ name: "", quantity: "", unit: "" }]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFood(null);
    setIngredients([{ name: "", quantity: "", unit: "" }]);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleSaveWithIngredients = async () => {
    if (!selectedFood) return;

    // Filter out empty ingredients
    const validIngredients = ingredients.filter(
      ing => ing.name.trim() && ing.quantity.trim() && ing.unit.trim()
    );

    setMessage("");
    try {
      await apiFetch("/api/food/save", {
        method: "POST",
        body: JSON.stringify({
          name: selectedFood.name,
          category: selectedFood.category,
          ingredients: validIngredients
        })
      });
      
      setMessage(`✓ "${selectedFood.name}" saved to database!`);
      handleCloseModal();
      
      // Refresh search to update the results
      const data = await apiFetch(`/api/food/search?query=${encodeURIComponent(query)}`);
      setResults(data.api || []);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const hasResults = results.length > 0;

  return (
    <>
      <NavBar />
      <div className="food-search-page">
        <div className="search-card">
          <div className="search-header">
            <h2>Search Foods</h2>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search for chicken, apple, pasta..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn-search" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {message && (
            <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
              {message}
            </div>
          )}

          {error && (
            <div className="message error">{error}</div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Searching foods...</p>
            </div>
          )}

          {!loading && hasResults && (
            <div className="results-container">
              {/* Spoonacular API Results */}
              <div className="results-section">
                <h3 className="section-title">
                  {results.length} {results.length === 1 ? 'recipe' : 'recipes'} from Spoonacular
                </h3>
                <div className="results-grid">
                  {results.map((food, idx) => (
                    <div key={idx} className="food-card api-card">
                      {food.image && (
                        <img src={food.image} alt={food.name} className="food-image" />
                      )}
                      <div className="food-header">
                        <h4 className="food-name">{food.name}</h4>
                        {food.category && <span className="food-category">{food.category}</span>}
                      </div>
                      
                      {/* Recipe Info */}
                      <div className="recipe-info">
                        {food.servings && (
                          <span className="recipe-meta">🍽️ {food.servings} servings</span>
                        )}
                        {food.readyInMinutes && (
                          <span className="recipe-meta">⏱️ {food.readyInMinutes} min</span>
                        )}
                      </div>
                      
                      {/* Ingredients Preview */}
                      {food.ingredients && food.ingredients.length > 0 && (
                        <div className="ingredients-preview">
                          <p className="ingredients-label">🥘 Ingredients ({food.ingredients.length}):</p>
                          <ul className="ingredients-list-preview">
                            {food.ingredients.slice(0, 3).map((ing, i) => (
                              <li key={i}>
                                {ing.quantity} {ing.unit} {ing.name}
                              </li>
                            ))}
                            {food.ingredients.length > 3 && (
                              <li className="more">+{food.ingredients.length - 3} more...</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      <div className="food-actions">
                        <button
                          className="btn-save"
                          onClick={() => handleOpenModal(food)}
                        >
                          {food.ingredients && food.ingredients.length > 0 
                            ? 'Review & Save to Database' 
                            : 'Add Ingredients & Save'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!loading && !hasResults && hasSearched && (
            <div className="empty-state">
              <p>No results found for "{query}"</p>
              <p className="empty-hint">Try a different search term</p>
            </div>
          )}

          {!loading && !hasSearched && (
            <div className="empty-state">
              <p>Start by searching for a food item</p>
              <p className="empty-hint">Try "chicken", "apple", or "pasta"</p>
            </div>
          )}
        </div>

        {/* Modal for adding ingredients */}
        {showModal && selectedFood && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Review Recipe: {selectedFood.name}</h3>
                <button className="modal-close" onClick={handleCloseModal}>&times;</button>
              </div>
              
              <div className="modal-body">
                <div className="modal-recipe-info">
                  <p className="recipe-source">� From Spoonacular Recipe Database</p>
                  {selectedFood.servings && (
                    <p className="recipe-detail">🍽️ Serves: {selectedFood.servings}</p>
                  )}
                  {selectedFood.readyInMinutes && (
                    <p className="recipe-detail">⏱️ Ready in: {selectedFood.readyInMinutes} minutes</p>
                  )}
                </div>
                <p className="modal-note">
                  {ingredients.length > 1 
                    ? "Ingredients have been auto-populated from Spoonacular. Review and edit as needed before saving."
                    : "Add your recipe ingredients below:"}
                </p>
                
                <div className="ingredients-form">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-row">
                      <input
                        type="text"
                        placeholder="Ingredient name"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        className="ingredient-input"
                      />
                      <input
                        type="text"
                        placeholder="Quantity"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        className="ingredient-input small"
                      />
                      <input
                        type="text"
                        placeholder="Unit"
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                        className="ingredient-input small"
                      />
                      {ingredients.length > 1 && (
                        <button 
                          className="btn-remove"
                          onClick={() => handleRemoveIngredient(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button className="btn-add-ingredient" onClick={handleAddIngredient}>
                  + Add Another Ingredient
                </button>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button className="btn-save-food" onClick={handleSaveWithIngredients}>
                  Save to Database
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

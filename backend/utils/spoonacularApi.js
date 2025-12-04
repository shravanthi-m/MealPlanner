import axios from 'axios';

const BASE_URL = 'https://api.spoonacular.com';

/**
 * Get the Spoonacular API key from environment
 * @returns {string} API key
 */
function getApiKey() {
  return process.env.SPOONACULAR_API_KEY;
}

/**
 * Search for recipes with ingredients using Spoonacular API
 * @param {String} query - Search term (e.g., "chicken", "pasta")
 * @param {Number} number - Number of results to return (default: 10)
 * @returns {Promise<Array>} Array of recipes with ingredients
 */
export async function searchRecipes(query, number = 10) {
  try {
    const apiKey = getApiKey();
    console.log(`Spoonacular: Searching for "${query}"...`);
    console.log(`Spoonacular API Key: ${apiKey ? 'Set (' + apiKey.substring(0, 8) + '...)' : 'NOT SET'}`);
    
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: apiKey,
        query: query,
        number: number,
        addRecipeInformation: true,
        fillIngredients: true,
        instructionsRequired: false,
      },
    });

    console.log(`Spoonacular API: Found ${response.data.results?.length || 0} recipes`);
    
    if (!response.data.results || response.data.results.length === 0) {
      return [];
    }

    // Transform Spoonacular data to our format
    return response.data.results.map(recipe => ({
      name: recipe.title,
      category: recipe.dishTypes?.length > 0 ? recipe.dishTypes[0] : 'Recipe',
      spoonacular_id: recipe.id,
      image: recipe.image,
      servings: recipe.servings,
      readyInMinutes: recipe.readyInMinutes,
      ingredients: recipe.extendedIngredients?.map(ing => ({
        name: ing.name || ing.original,
        quantity: ing.amount || '',
        unit: ing.unit || '',
        original: ing.original // Keep original string like "2 cups chicken breast"
      })) || [],
      source: 'spoonacular'
    }));
  } catch (error) {
    console.error('Spoonacular API error:', error.response?.data || error.message);
    return [];
  }
}

/**
 * Get detailed recipe information by ID
 * @param {Number} recipeId - Spoonacular recipe ID
 * @returns {Promise<Object>} Detailed recipe information
 */
export async function getRecipeDetails(recipeId) {
  try {
    const apiKey = getApiKey();
    const response = await axios.get(`${BASE_URL}/recipes/${recipeId}/information`, {
      params: {
        apiKey: apiKey,
        includeNutrition: true,
      },
    });

    const recipe = response.data;
    
    return {
      name: recipe.title,
      category: recipe.dishTypes?.length > 0 ? recipe.dishTypes[0] : 'Recipe',
      spoonacular_id: recipe.id,
      image: recipe.image,
      servings: recipe.servings,
      readyInMinutes: recipe.readyInMinutes,
      ingredients: recipe.extendedIngredients?.map(ing => ({
        name: ing.name || ing.original,
        quantity: ing.amount || '',
        unit: ing.unit || '',
        original: ing.original
      })) || [],
      nutrition: recipe.nutrition ? {
        calories: recipe.nutrition.nutrients?.find(n => n.name === 'Calories')?.amount,
        protein: recipe.nutrition.nutrients?.find(n => n.name === 'Protein')?.amount,
        carbs: recipe.nutrition.nutrients?.find(n => n.name === 'Carbohydrates')?.amount,
        fat: recipe.nutrition.nutrients?.find(n => n.name === 'Fat')?.amount,
      } : null,
      source: 'spoonacular'
    };
  } catch (error) {
    console.error('Error getting recipe details:', error.response?.data || error.message);
    return null;
  }
}

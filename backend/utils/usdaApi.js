import axios from "axios";

const USDA_API_KEY = process.env.USDA_API_KEY;
console.log('Loaded USDA_API_KEY:', USDA_API_KEY);
const BASE_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

/**
 * Search for a food and get its category from USDA FoodData Central
 * @param {string} query - Food name to search
 * @returns {Promise<string|null>} - Category name or null if not found
 */
export async function getFoodCategoryFromUSDA(query) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        api_key: USDA_API_KEY,
        query,
        pageSize: 1
      }
    });
    const foods = response.data.foods;
    if (foods && foods.length > 0) {
      // USDA returns foodCategory field
      return foods[0].foodCategory || null;
    }
    return null;
  } catch (err) {
    console.error("USDA API error:", err.response?.data || err.message);
    return null;
  }
}

import axios from 'axios';

const tokenUrl = 'https://oauth.fatsecret.com/connect/token';

/**
 * Fetches an access token from FatSecret API
 * @returns {Promise<Object>} API response data
 */
export async function getAccessToken() {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'client_credentials');
  formData.append('scope', 'basic'); // Adjust scope as needed

  const clientId = process.env.FAT_SECRET_CLIENT_ID;
  const clientSecret = process.env.FAT_SECRET_CLIENT_SECRET;

  try {
    const response = await axios.post(tokenUrl, formData, {
      auth: {
        username: clientId,
        password: clientSecret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error.response ? error.response.data : error.message);
  }
}

/**
 * Makes an authenticated request to the FatSecret API
 * @param {String} accessToken access token from 'getAccessToken' method
 * @param {String} method search method to use (e.g. 'foods.search')
 * @param {Object} params search parameters (e.g. {search_expression: 'apple'})
 * @returns {Promise<Object>} API response data
 */
export async function callFatSecretApi(accessToken, method, params = {}) {
  const apiUrl = 'https://platform.fatsecret.com/rest/server.api';
  const response = await axios.get(apiUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    params: {
      ...params,
      method: method,
      format: 'json',
    },
  });
  return response.data;
}

/**
 * @typedef {Object} V1Food
 * @property {String} name
 * @property {String} category
 * @property {String} food_id
 * @property {String} description
 * @property {Object} nutrition
 * @property {Array} ingredients
 */
/**
 * 
 * @param {Object} food 
 * @param {String} food.food_name
 * @param {String} food.food_type
 * @param {String} food.food_id
 * @param {String} food.food_description
 * @returns {V1Food} converted food object
 */
function fsv1FoodtoFood(food) {
    // Parse nutrition from description (format: "Per 100g - Calories: 165kcal | Fat: 3.6g | Carbs: 0g | Protein: 31g")
    const nutritionData = parseNutritionFromDescription(food.food_description);
    
    return {
        name: food.food_name,
        category: food.food_type,
        food_id: food.food_id,
        description: food.food_description || '',
        nutrition: nutritionData,
        ingredients: [], // FatSecret doesn't provide ingredient lists, only nutrition info
    };
}

/**
 * Parse nutrition info from FatSecret description string
 * @param {String} description 
 * @returns {Object} nutrition object with calories, fat, carbs, protein, serving
 */
function parseNutritionFromDescription(description) {
    if (!description) return null;
    
    const nutrition = {
        serving: '',
        calories: '',
        fat: '',
        carbs: '',
        protein: ''
    };
    
    // Extract serving size (e.g., "Per 100g", "Per 1 cup")
    const servingMatch = description.match(/Per ([^-]+)/i);
    if (servingMatch) {
        nutrition.serving = servingMatch[1].trim();
    }
    
    // Extract calories
    const caloriesMatch = description.match(/Calories:\s*(\d+(?:\.\d+)?)\s*kcal/i);
    if (caloriesMatch) {
        nutrition.calories = caloriesMatch[1];
    }
    
    // Extract fat
    const fatMatch = description.match(/Fat:\s*(\d+(?:\.\d+)?)\s*g/i);
    if (fatMatch) {
        nutrition.fat = fatMatch[1];
    }
    
    // Extract carbs
    const carbsMatch = description.match(/Carbs:\s*(\d+(?:\.\d+)?)\s*g/i);
    if (carbsMatch) {
        nutrition.carbs = carbsMatch[1];
    }
    
    // Extract protein
    const proteinMatch = description.match(/Protein:\s*(\d+(?:\.\d+)?)\s*g/i);
    if (proteinMatch) {
        nutrition.protein = proteinMatch[1];
    }
    
    return nutrition;
}

/**
 * Get detailed food information by ID
 * @param {String} accessToken access token from 'getAccessToken' method
 * @param {String} foodId FatSecret food ID
 * @returns {Promise<Object>} Detailed food information including servings
 */
export async function getFoodDetails(accessToken, foodId) {
  try {
    const params = {
      food_id: foodId,
    };

    const data = await callFatSecretApi(accessToken, 'food.get.v2', params);
    
    console.log('FatSecret Food Details:', JSON.stringify(data, null, 2));
    
    return data.food || null;
  } catch (error) {
    console.error('Error getting food details:', error.response ? error.response.data : error.message);
    return null;
  }
}

/**
 * Search for food by expression using foods.search method in FatSecret API
 * @param {String} accessToken access token from 'getAccessToken' method
 * @param {String} searchExpression name of the food to search
 * @param {number} max_results maximum number of results to return
 * @returns {Promise<Array<V1Food>>} API response data
 */
export async function searchFoods(accessToken, searchExpression, max_results=10) {
  try {
    // create params object  
    const params = {
        search_expression: searchExpression,
        max_results: max_results,
    };

    // call foods.search method
    const data = await callFatSecretApi(accessToken, 'foods.search', params);
    
    // Log the response for debugging
    console.log('FatSecret API Response:', JSON.stringify(data, null, 2));

    // Check if results exist
    if (!data || !data.foods || !data.foods.food) {
      console.log('No foods found in API response');
      return [];
    }

    // get array of foods from response
    let foods = Array.isArray(data.foods.food) ? data.foods.food : [data.foods.food];

    // convert each food to our Food model format
    foods = foods.map(fsv1FoodtoFood);
    
    console.log(`Found ${foods.length} foods from FatSecret`);
    return foods;
  } catch (error) {
    console.error('Error searching foods:', error.response ? error.response.data : error.message);
    return [];
  }

}
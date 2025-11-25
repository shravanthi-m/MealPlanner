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
 * @property {Array} ingredients
 */
/**
 * 
 * @param {Object} food 
 * @param {String} food.food_name
 * @param {String} food.food_type
 * @returns {V1Food} converted food object
 */
function fsv1FoodtoFood(food) {
    return {
        name: food.food_name,
        category: food.food_type,
        ingredients: [], // FatSecret API does not provide ingredient details in search
    };
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

    // get array of foods from response
    let foods = Array.isArray(data.foods.food) ? data.foods.food : [data.foods.food];

    // convert each food to our Food model format
    foods = foods.map(fsv1FoodtoFood);
    
    return foods;
  } catch (error) {
    console.error('Error searching foods:', error.response ? error.response.data : error.message);
    return [];
  }

}
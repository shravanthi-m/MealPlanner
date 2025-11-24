import axios from 'axios';

const clientId = process.env.FAT_SECRET_CLIENT_ID;
const clientSecret = process.env.FAT_SECRET_CLIENT_SECRET;

const tokenUrl = 'https://oauth.fatsecret.com/connect/token';

/**
 * Fetches an access token from FatSecret API
 * @returns {Promise<Object>} API response data
 */
export async function getAccessToken() {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'client_credentials');
  formData.append('scope', 'basic'); // Adjust scope as needed

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
 * Search for food by expression using foods.search method in FatSecret API
 * @param {String} accessToken access token from 'getAccessToken' method
 * @param {String} searchExpression name of the food to search
 * @param {number} max_results maximum number of results to return
 * @returns {Promise<Object>} API response data
 */
export async function searchFoods(accessToken, searchExpression, max_results=10) {
  const params = {
    search_expression: searchExpression,
    max_results: max_results,
  };
  const data = await callFatSecretApi(accessToken, 'foods.search', params);
  return data;
}
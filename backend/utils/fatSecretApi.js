import axios from 'axios';

const tokenUrl = 'https://oauth.fatsecret.com/connect/token';

/**
 * Fetches an access token from FatSecret API
 * @returns {Promise<Object>} API response data
 */
export async function getAccessToken(scope='basic') {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'client_credentials');
  formData.append('scope', scope); // Adjust scope as needed

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
 * @param {Object} data
 * @param {Object} data.foods
 * @param {Object} data.foods.food
 * @returns {Array<V1Food>} converted food object
 */
function fsv1FoodtoFood(data) {
    // get array of foods from response
    let foods = Array.isArray(data.foods.food) ? data.foods.food : [data.foods.food];

    // convert each food to our Food model format
    foods = foods.map((food) => {
        let nutrition_information = {};

        if (typeof food.food_description === 'string') {
            const [serving, nutrition] = food.food_description.split(' - ');
            const nutrition_ = Object.fromEntries(
                nutrition.split(' | ').map((info) => {
                    return info.split(': ');
                })
            );
            nutrition_information = {serving: serving.split('Per ')[1], ...nutrition_};
        };

        return {
            name: food.food_name,
            category: food.food_type,
            nutrition_information: nutrition_information,
            ingredients: [], // FatSecret API does not provide ingredient details in search
        };
    });

    return foods;
}

function fsv4FoodtoFood(data) {
    // get array of foods from response
    let foods = Array.isArray(data.foods_search.results.food) ? data.foods_search.results.food : [data.foods_search.results.food];

    // convert each food to our Food model format
    foods = foods.map((food) => {
        return {
            name: food.food_name,
            category: food.food_type,
            attributes: food.food_attributes,
            ingredients: [], // FatSecret API does not provide ingredient details in search
        }
    });

    // Placeholder for future FatSecret v4 parsing logic
    return foods;
}

function getVersionParameters(version) {
    switch(version) {
        case 'v1':
            return {
                method: 'foods.search',
                parser: fsv1FoodtoFood
            };
        case 'v4':
            return {
                method: 'foods.search.v4',
                parser: fsv4FoodtoFood
            }
        // Future versions can be handled here
        default:
            throw new Error(`Unsupported API version: ${version}`);
    }
}

/**
 * Search for food by expression using foods.search method in FatSecret API
 * @param {String} accessToken access token from 'getAccessToken' method
 * @param {String} searchExpression name of the food to search
 * @param {number} [max_results] maximum number of results to return
 * @param {string} [version] API version to use ('v1' or 'v4')
 * @param {Object} [searchParams] additional search parameters
 * @returns {Promise<Array<V1Food>>} API response data
 */
export async function searchFoods(accessToken, searchExpression, max_results=10, version='v1', searchParams={}) {
  try {
    // create params object  
    const params = {
        search_expression: searchExpression,
        max_results: max_results,
        ...searchParams
    };

    // get driver for api version
    const driver = getVersionParameters(version);

    // call foods.search method
    const data = await callFatSecretApi(accessToken, driver.method, params);
    
    // call version parser on foods
    const foods = driver.parser(data);

    return foods;
  } catch (error) {
    console.error('Error searching foods:', error.response ? error.response.data : error.message);
    return [];
  }

}
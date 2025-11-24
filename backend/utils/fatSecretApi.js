import axios from 'axios';

const clientId = process.env.FAT_SECRET_CLIENT_ID;
const clientSecret = process.env.FAT_SECRET_CLIENT_SECRET;

const tokenUrl = 'https://oauth.fatsecret.com/connect/token';

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
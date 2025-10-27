// imports
import { createStore, addMiddleware, setStoreValue } from 'pulsy';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api/auth';

// Create a store to hold the user and token
createStore('auth', {
  user: null,
  token: null,
}, { persist: true }); // Persist the auth state in localStorage

// Middleware to add Authorization header for authenticated requests
addMiddleware('auth', (nextValue, prevValue, storeName) => {
  if (nextValue.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${nextValue.token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
  return nextValue;
});

/**
 * 
 * @param {String} username 
 * @param {String} email 
 * @param {String} password 
 * @returns 
 */
export const register = async (username, email, password) => {
  try {
    console.log(`${API_URL}/register`);
    const response = await axios.post(
        `${API_URL}/register`,
        { username, email, password }
    );
  
    return true;
  } catch (error) {
    console.error('Login failed', error);
    return false;
  }
};

/**
 * 
 * @param {String} username 
 * @param {String} password 
 * @returns 
 */
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email: username, password: password });
    const { token } = response.data;

    // Set token and user info in Pulsy store
    setStoreValue('auth', { token, user: { username } });

    return true;
  } catch (error) {
    console.error('Login failed', error);
    return false;
  }
};

// export const validateToken = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/validate`);
//     const user = response.data.user;

//     // Update the store with the user info
//     setStoreValue('auth', { user, token: localStorage.getItem('auth_token') });
//     return true;
//   } catch (error) {
//     console.error('Token validation failed', error);
//     return false;
//   }
// };

export const logout = () => {
  setStoreValue('auth', { user: null, token: null });
  localStorage.removeItem('pulsy_auth');
};
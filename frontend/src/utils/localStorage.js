/**
 * LocalStorage utility functions for user data persistence
 */

const STORAGE_KEYS = {
  TOKEN: 'meditrack_token',
  USER: 'meditrack_user',
  THEME: 'meditrack_theme', // For future use
};

/**
 * Get user data from localStorage
 * @returns {Object|null} User object or null
 */
export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
    return null;
  }
};

/**
 * Save user data to localStorage
 * @param {Object} user - User object to save
 */
export const saveUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

/**
 * Get token from localStorage
 * @returns {string|null} Token or null
 */
export const getTokenFromStorage = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error reading token from localStorage:', error);
    return null;
  }
};

/**
 * Save token to localStorage
 * @param {string} token - Token to save
 */
export const saveTokenToStorage = (token) => {
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  } catch (error) {
    console.error('Error saving token to localStorage:', error);
  }
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error clearing auth data from localStorage:', error);
  }
};

/**
 * Get all auth data from localStorage
 * @returns {Object} Object with token and user
 */
export const getAuthFromStorage = () => {
  return {
    token: getTokenFromStorage(),
    user: getUserFromStorage(),
  };
};

export {STORAGE_KEYS};


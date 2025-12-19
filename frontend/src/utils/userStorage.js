/**
 * User storage utility - provides easy access to user data
 * from both Redux store and localStorage
 */

import {getUserFromStorage, getTokenFromStorage} from './localStorage';

/**
 * Get current user from Redux store or localStorage
 * @param {Function} getState - Redux getState function (optional)
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = (getState = null) => {
  // Try Redux store first
  if (getState) {
    const state = getState();
    if (state?.auth?.user) {
      return state.auth.user;
    }
  }
  
  // Fallback to localStorage
  return getUserFromStorage();
};

/**
 * Get current token from Redux store or localStorage
 * @param {Function} getState - Redux getState function (optional)
 * @returns {string|null} Token or null
 */
export const getCurrentToken = (getState = null) => {
  // Try Redux store first
  if (getState) {
    const state = getState();
    if (state?.auth?.token) {
      return state.auth.token;
    }
  }
  
  // Fallback to localStorage
  return getTokenFromStorage();
};

/**
 * Check if user is authenticated
 * @param {Function} getState - Redux getState function (optional)
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = (getState = null) => {
  // Try Redux store first
  if (getState) {
    const state = getState();
    if (state?.auth?.isAuthenticated !== undefined) {
      return state.auth.isAuthenticated;
    }
  }
  
  // Fallback to checking localStorage
  const token = getTokenFromStorage();
  const user = getUserFromStorage();
  return !!(token && user);
};

/**
 * Get user ID from Redux store or localStorage
 * @param {Function} getState - Redux getState function (optional)
 * @returns {number|null} User ID or null
 */
export const getUserId = (getState = null) => {
  const user = getCurrentUser(getState);
  return user?.id || user?.userId || null;
};

/**
 * Get user email from Redux store or localStorage
 * @param {Function} getState - Redux getState function (optional)
 * @returns {string|null} User email or null
 */
export const getUserEmail = (getState = null) => {
  const user = getCurrentUser(getState);
  return user?.email || null;
};


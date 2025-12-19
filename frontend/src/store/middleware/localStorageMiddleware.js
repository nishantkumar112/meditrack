/**
 * Redux middleware to automatically sync auth state to localStorage
 * This ensures localStorage is always in sync with Redux state
 */
export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Only sync auth-related actions
  if (action.type?.startsWith('auth/')) {
    const state = store.getState();
    const {auth} = state;
    
    // Sync to localStorage
    if (auth.token) {
      localStorage.setItem('meditrack_token', auth.token);
    } else {
      localStorage.removeItem('meditrack_token');
    }
    
    if (auth.user) {
      localStorage.setItem('meditrack_user', JSON.stringify(auth.user));
    } else {
      localStorage.removeItem('meditrack_user');
    }
  }
  
  return result;
};


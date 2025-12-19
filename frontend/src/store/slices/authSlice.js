import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {userAPI} from '../../services/api';
import {
  getAuthFromStorage,
  saveUserToStorage,
  saveTokenToStorage,
  clearAuthFromStorage,
} from '../../utils/localStorage';

// Async thunk for loading user
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, {rejectWithValue}) => {
    try {
      const response = await userAPI.getCurrentUser();
      return response.data;
    } catch (error) {
      // If token is invalid, clear it
      clearAuthFromStorage();
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load user'
      );
    }
  }
);

// Initialize state from localStorage
const {token, user} = getAuthFromStorage();
const initialState = {
  user: user,
  token: token,
  loading: !!token, // Only loading if we have a token to verify
  isAuthenticated: !!token && !!user,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const {token, user} = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.error = null;
      // Persist to localStorage
      saveTokenToStorage(token);
      saveUserToStorage(user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear from localStorage
      clearAuthFromStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = {...state.user, ...action.payload};
      // Persist updated user to localStorage
      saveUserToStorage(state.user);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      // Persist to localStorage
      saveUserToStorage(action.payload);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload && !!state.user;
      // Persist to localStorage
      saveTokenToStorage(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        // Persist updated user to localStorage
        saveUserToStorage(action.payload);
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.payload;
        // Clear from localStorage on error
        clearAuthFromStorage();
      });
  },
});

export const {login, logout, clearError, updateUser, setUser, setToken} =
  authSlice.actions;
export default authSlice.reducer;

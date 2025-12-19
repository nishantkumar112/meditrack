import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const {id, message, type, duration} = action.payload;
      state.toasts.push({id, message, type, duration});
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const {addToast, removeToast, clearToasts} = toastSlice.actions;

// Helper action creators (thunks) - using createAsyncThunk for proper typing
export const showSuccess = (message, duration = 5000) => {
  return (dispatch) => {
    const id = Date.now() + Math.random();
    dispatch(addToast({id, message, type: 'success', duration}));
    return id;
  };
};

export const showError = (message, duration = 5000) => {
  return (dispatch) => {
    const id = Date.now() + Math.random();
    dispatch(addToast({id, message, type: 'error', duration}));
    return id;
  };
};

export const showWarning = (message, duration = 5000) => {
  return (dispatch) => {
    const id = Date.now() + Math.random();
    dispatch(addToast({id, message, type: 'warning', duration}));
    return id;
  };
};

export const showInfo = (message, duration = 5000) => {
  return (dispatch) => {
    const id = Date.now() + Math.random();
    dispatch(addToast({id, message, type: 'info', duration}));
    return id;
  };
};

export default toastSlice.reducer;


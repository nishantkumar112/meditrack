import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

// Store toast functions - will be set by the interceptor
let toastFunctions = null;

export const setToastFunctions = (functions) => {
  toastFunctions = functions;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store reference to Redux store for accessing token
let reduxStore = null;
export const setReduxStore = (store) => {
  reduxStore = store;
};

// Add token to requests
api.interceptors.request.use(
  (config) => {
    // Try to get token from Redux store first, fallback to localStorage
    let token = null;
    if (reduxStore) {
      const state = reduxStore.getState();
      token = state?.auth?.token;
    }
    if (!token) {
      token = localStorage.getItem('token') || localStorage.getItem('meditrack_token');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // If response has standardized format, extract data
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      // Standardized ApiResponse format
      if (response.data.success && response.data.data !== undefined) {
        // Show success toast if message exists
        if (response.data.message && toastFunctions) {
          toastFunctions.showSuccess(response.data.message);
        }
        // Replace response.data with the actual data for backward compatibility
        response.data = response.data.data;
      } else if (!response.data.success) {
        // Handle error response
        const error = new Error(response.data.message || 'An error occurred');
        error.response = {
          ...response,
          status: response.data.status || response.status,
          data: {
            message: response.data.message,
            errors: response.data.errors,
          },
        };
        // Show error toast
        if (toastFunctions && response.data.message) {
          toastFunctions.showError(response.data.message);
        }
        return Promise.reject(error);
      }
    } else {
      // For non-standardized responses, show success for POST/PUT/DELETE
      const method = response.config?.method?.toUpperCase();
      if ((method === 'POST' || method === 'PUT' || method === 'DELETE') && toastFunctions) {
        const messages = {
          POST: 'Created successfully',
          PUT: 'Updated successfully',
          DELETE: 'Deleted successfully',
        };
        toastFunctions.showSuccess(messages[method] || 'Operation successful');
      }
    }
    return response;
  },
  (error) => {
    // Handle standardized error format
    let errorMessage = 'An error occurred';
    
    if (error.response?.data) {
      if (typeof error.response.data === 'object' && 'success' in error.response.data) {
        if (!error.response.data.success) {
          errorMessage = error.response.data.message || errorMessage;
          error.response.data = {
            message: error.response.data.message,
            errors: error.response.data.errors,
          };
        }
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Show error toast
    if (toastFunctions) {
      toastFunctions.showError(errorMessage);
    }
    
    if (error.response?.status === 401) {
      // Clear auth from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('meditrack_token');
      localStorage.removeItem('meditrack_user');
      
      // Dispatch logout action if Redux store is available
      if (reduxStore) {
        const {logout} = require('../store/slices/authSlice');
        reduxStore.dispatch(logout());
      }
      
      if (toastFunctions) {
        toastFunctions.showError('Session expired. Please login again.');
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  requestOtp: (email) => api.post('/auth/request-otp', {email}),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', {email, otp}),
};

export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', null, {params: data}),
  toggleMfa: () => api.post('/users/me/toggle-mfa'),
};

export const familyMemberAPI = {
  getAll: () => api.get('/family-members'),
  getById: (id) => api.get(`/family-members/${id}`),
  create: (data) => api.post('/family-members', data),
  update: (id, data) => api.put(`/family-members/${id}`, data),
  delete: (id) => api.delete(`/family-members/${id}`),
};

export const healthRecordAPI = {
  getAll: (familyMemberId) => {
    const params = familyMemberId ? {familyMemberId} : {};
    return api.get('/health-records', {params});
  },
  getById: (id) => api.get(`/health-records/${id}`),
  create: (data) => api.post('/health-records', data),
  update: (id, data) => api.put(`/health-records/${id}`, data),
  delete: (id) => api.delete(`/health-records/${id}`),
};

export const medicationAPI = {
  getAll: (familyMemberId) => {
    const params = familyMemberId ? {familyMemberId} : {};
    return api.get('/medications', {params});
  },
  getById: (id) => api.get(`/medications/${id}`),
  create: (data) => api.post('/medications', data),
  update: (id, data) => api.put(`/medications/${id}`, data),
  delete: (id) => api.delete(`/medications/${id}`),
  createReminder: (medicationId, data) =>
    api.post(`/medications/${medicationId}/reminders`, data),
};

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
};

export const suggestionAPI = {
  getMedicines: (query) => {
    const params = query ? {query} : {};
    return api.get('/suggestions/medicines', {params});
  },
  getMedicalTests: (query) => {
    const params = query ? {query} : {};
    return api.get('/suggestions/medical-tests', {params});
  },
  getRecordTypes: () => api.get('/suggestions/record-types'),
};

export default api;

import {useDispatch, useSelector} from 'react-redux';
import {useCallback} from 'react';
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  removeToast as removeToastAction,
} from './slices/toastSlice';
import {
  login as loginAction,
  logout as logoutAction,
  clearError as clearErrorAction,
  updateUser as updateUserAction,
  setUser as setUserAction,
  setToken as setTokenAction,
  loadUser as loadUserThunk,
} from './slices/authSlice';

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Custom hooks for auth
export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return {
    ...auth,
    login: useCallback(
      (token, userData) => {
        dispatch(loginAction({token, user: userData}));
      },
      [dispatch]
    ),
    logout: useCallback(() => {
      dispatch(logoutAction());
    }, [dispatch]),
    clearError: useCallback(() => {
      dispatch(clearErrorAction());
    }, [dispatch]),
    updateUser: useCallback(
      (userData) => {
        dispatch(updateUserAction(userData));
      },
      [dispatch]
    ),
    setUser: useCallback(
      (user) => {
        dispatch(setUserAction(user));
      },
      [dispatch]
    ),
    setToken: useCallback(
      (token) => {
        dispatch(setTokenAction(token));
      },
      [dispatch]
    ),
    loadUser: useCallback(() => {
      dispatch(loadUserThunk());
    }, [dispatch]),
  };
};

// Custom hooks for toast
export const useToast = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.toast.toasts);

  return {
    toasts,
    showSuccess: useCallback(
      (message, duration) => {
        return dispatch(showSuccess(message, duration));
      },
      [dispatch]
    ),
    showError: useCallback(
      (message, duration) => {
        return dispatch(showError(message, duration));
      },
      [dispatch]
    ),
    showWarning: useCallback(
      (message, duration) => {
        return dispatch(showWarning(message, duration));
      },
      [dispatch]
    ),
    showInfo: useCallback(
      (message, duration) => {
        return dispatch(showInfo(message, duration));
      },
      [dispatch]
    ),
    removeToast: useCallback(
      (id) => {
        dispatch(removeToastAction(id));
      },
      [dispatch]
    ),
  };
};

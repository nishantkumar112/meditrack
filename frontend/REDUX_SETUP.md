# Redux Setup for MediTrack Frontend

## Overview

The frontend has been migrated from React Context API to Redux Toolkit for global state management. This provides better performance, developer tools, and scalability.

## Structure

```
frontend/src/store/
├── store.js              # Redux store configuration
├── hooks.js              # Custom hooks for Redux
└── slices/
    ├── authSlice.js      # Authentication state
    └── toastSlice.js     # Toast notifications state
```

## Redux Store

The store is configured with:
- **auth**: User authentication state (user, token, loading, isAuthenticated)
- **toast**: Toast notifications state (toasts array)

## Usage

### Authentication

```javascript
import {useAuth} from '../store/hooks';

const MyComponent = () => {
  const {user, loading, isAuthenticated, login, logout, loadUser} = useAuth();
  
  // Use auth state and actions
};
```

### Toast Notifications

```javascript
import {useToast} from '../store/hooks';

const MyComponent = () => {
  const {showSuccess, showError, showWarning, showInfo, removeToast} = useToast();
  
  // Show notifications
  showSuccess('Operation successful!');
  showError('Something went wrong!');
};
```

## Migration from Context API

### Before (Context API):
```javascript
import {useAuth} from '../context/AuthContext';
```

### After (Redux):
```javascript
import {useAuth} from '../store/hooks';
```

The API is the same, so components work without changes!

## Redux DevTools

Redux DevTools extension is enabled. Install the browser extension to:
- Inspect state
- Time-travel debugging
- Action replay
- State diff

## Benefits

1. **Performance**: Better re-render optimization
2. **DevTools**: Powerful debugging tools
3. **Scalability**: Easy to add new slices
4. **Predictability**: Single source of truth
5. **Middleware**: Easy to add logging, persistence, etc.

## Adding New Slices

To add a new slice:

1. Create `store/slices/mySlice.js`:
```javascript
import {createSlice} from '@reduxjs/toolkit';

const mySlice = createSlice({
  name: 'myFeature',
  initialState: { /* ... */ },
  reducers: { /* ... */ },
});

export const {action1, action2} = mySlice.actions;
export default mySlice.reducer;
```

2. Add to `store.js`:
```javascript
import myReducer from './slices/mySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    myFeature: myReducer, // Add here
  },
});
```

3. Create custom hook in `hooks.js`:
```javascript
export const useMyFeature = () => {
  const myFeature = useAppSelector((state) => state.myFeature);
  const dispatch = useAppDispatch();
  // ... return state and actions
};
```

## State Persistence

Currently, auth state is persisted to localStorage:
- Token is stored in localStorage
- User data is stored in localStorage
- On app load, token is checked and user is loaded if token exists

## Notes

- All existing components continue to work
- Context API files are kept for reference but not used
- Redux Toolkit uses Immer for immutable updates
- All actions are automatically serializable


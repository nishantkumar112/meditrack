# User Storage Guide - Redux + LocalStorage

## Overview

User information is now stored in **both Redux global state and localStorage**, with automatic synchronization between them. This ensures:

1. **Redux State** - Fast access during app runtime
2. **LocalStorage** - Persistence across page refreshes
3. **Automatic Sync** - Changes in Redux automatically sync to localStorage

## Architecture

### Storage Flow

```
User Action → Redux Action → Redux State → Middleware → LocalStorage
                                    ↑
                                    └─── Initial Load (on app start)
```

### Storage Keys

- **Token**: `meditrack_token` (also supports legacy `token` key)
- **User**: `meditrack_user` (also supports legacy `user` key)

## Usage

### 1. Using Redux Hook (Recommended)

```javascript
import {useAuth} from '../store/hooks';

const MyComponent = () => {
  const {user, token, isAuthenticated, loading} = useAuth();
  
  // Access user data
  console.log(user.email);
  console.log(user.firstName);
  console.log(user.id);
  
  // Check authentication
  if (isAuthenticated) {
    // User is logged in
  }
};
```

### 2. Using Utility Functions

```javascript
import {getCurrentUser, getCurrentToken, isAuthenticated} from '../utils/userStorage';
import {store} from '../store/store';

// Get user from Redux or localStorage
const user = getCurrentUser(store.getState);
const token = getCurrentToken(store.getState);
const authenticated = isAuthenticated(store.getState);
```

### 3. Direct LocalStorage Access

```javascript
import {
  getUserFromStorage,
  getTokenFromStorage,
  saveUserToStorage,
  saveTokenToStorage,
} from '../utils/localStorage';

// Get from localStorage
const user = getUserFromStorage();
const token = getTokenFromStorage();

// Save to localStorage (usually done automatically)
saveUserToStorage(user);
saveTokenToStorage(token);
```

## Available Actions

### Authentication Actions

```javascript
import {useAuth} from '../store/hooks';

const {login, logout, loadUser, updateUser, setUser, setToken} = useAuth();

// Login
login(token, userData);

// Logout
logout();

// Load user from API
loadUser();

// Update user (merges with existing)
updateUser({firstName: 'John'});

// Set user (replaces entire user object)
setUser(userObject);

// Set token only
setToken(tokenString);
```

## State Structure

### Redux Auth State

```javascript
{
  user: {
    id: 1,
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+1234567890",
    mfaEnabled: false,
    // ... other user fields
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  loading: false,
  isAuthenticated: true,
  error: null
}
```

### LocalStorage Structure

```json
{
  "meditrack_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "meditrack_user": "{\"id\":1,\"email\":\"user@example.com\",...}"
}
```

## Automatic Synchronization

### Middleware

A Redux middleware automatically syncs auth state to localStorage:

- **On Login**: Token and user saved to localStorage
- **On Logout**: Token and user removed from localStorage
- **On User Update**: Updated user saved to localStorage
- **On Load User**: Fresh user data saved to localStorage

### Initial Load

On app startup:
1. Redux store initializes from localStorage
2. If token exists, user data is loaded from localStorage
3. If token exists, `loadUser()` is called to verify and refresh user data

## Examples

### Example 1: Access User Data in Component

```javascript
import React from 'react';
import {useAuth} from '../store/hooks';

const UserProfile = () => {
  const {user, loading} = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  return (
    <div>
      <h1>Welcome, {user.firstName} {user.lastName}!</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber || 'Not set'}</p>
    </div>
  );
};
```

### Example 2: Update User Profile

```javascript
import {useAuth} from '../store/hooks';
import {userAPI} from '../services/api';

const ProfileForm = () => {
  const {user, updateUser} = useAuth();
  
  const handleUpdate = async (formData) => {
    try {
      await userAPI.updateProfile(formData);
      // Update Redux state (automatically syncs to localStorage)
      updateUser(formData);
    } catch (error) {
      console.error('Update failed', error);
    }
  };
  
  return (
    // ... form JSX
  );
};
```

### Example 3: Check Authentication Outside Component

```javascript
import {store} from '../store/store';
import {isAuthenticated, getCurrentUser} from '../utils/userStorage';

// In a utility function or service
export const checkAuth = () => {
  const authenticated = isAuthenticated(store.getState);
  const user = getCurrentUser(store.getState);
  
  if (authenticated && user) {
    console.log('User is authenticated:', user.email);
    return true;
  }
  return false;
};
```

### Example 4: Access User in API Service

```javascript
import {store} from '../store/store';
import {getCurrentUser} from '../utils/userStorage';

// In API service
export const makeAuthenticatedRequest = async (url) => {
  const user = getCurrentUser(store.getState);
  const token = store.getState().auth.token;
  
  // Use user data or token for request
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-User-Id': user?.id,
    }
  });
};
```

## Utility Functions

### LocalStorage Utilities (`utils/localStorage.js`)

- `getUserFromStorage()` - Get user from localStorage
- `saveUserToStorage(user)` - Save user to localStorage
- `getTokenFromStorage()` - Get token from localStorage
- `saveTokenToStorage(token)` - Save token to localStorage
- `clearAuthFromStorage()` - Clear all auth data
- `getAuthFromStorage()` - Get both token and user

### User Storage Utilities (`utils/userStorage.js`)

- `getCurrentUser(getState)` - Get user from Redux or localStorage
- `getCurrentToken(getState)` - Get token from Redux or localStorage
- `isAuthenticated(getState)` - Check if authenticated
- `getUserId(getState)` - Get user ID
- `getUserEmail(getState)` - Get user email

## Best Practices

### ✅ DO

1. **Use Redux hooks** in React components:
   ```javascript
   const {user} = useAuth();
   ```

2. **Use utility functions** outside components:
   ```javascript
   const user = getCurrentUser(store.getState);
   ```

3. **Let Redux handle persistence** - Don't manually write to localStorage

4. **Use actions** to update state:
   ```javascript
   updateUser(newData); // Automatically syncs to localStorage
   ```

### ❌ DON'T

1. **Don't directly access localStorage** in components:
   ```javascript
   // ❌ Bad
   const user = JSON.parse(localStorage.getItem('user'));
   
   // ✅ Good
   const {user} = useAuth();
   ```

2. **Don't manually sync** - Middleware handles it:
   ```javascript
   // ❌ Bad
   dispatch(updateUser(data));
   localStorage.setItem('user', JSON.stringify(data));
   
   // ✅ Good
   dispatch(updateUser(data)); // Auto-synced
   ```

3. **Don't bypass Redux** for state updates:
   ```javascript
   // ❌ Bad
   localStorage.setItem('user', JSON.stringify(user));
   
   // ✅ Good
   dispatch(setUser(user));
   ```

## Data Flow

### Login Flow

```
1. User submits login form
2. API returns token + user data
3. dispatch(login(token, userData))
4. Redux state updated
5. Middleware saves to localStorage
6. Component re-renders with new user
```

### Logout Flow

```
1. User clicks logout
2. dispatch(logout())
3. Redux state cleared
4. Middleware clears localStorage
5. Component re-renders (user = null)
6. Redirect to login
```

### Update User Flow

```
1. User updates profile
2. API call succeeds
3. dispatch(updateUser(newData))
4. Redux state merged with new data
5. Middleware saves updated user to localStorage
6. Component re-renders with updated user
```

## Error Handling

The system handles errors gracefully:

- **Invalid token**: Automatically cleared from both Redux and localStorage
- **API failure**: State remains, error stored in `auth.error`
- **LocalStorage errors**: Logged to console, app continues

## Migration Notes

### Legacy Support

The system supports both old and new localStorage keys:
- Old: `token`, `user`
- New: `meditrack_token`, `meditrack_user`

This ensures backward compatibility.

### API Interceptor

The API interceptor now:
1. Tries to get token from Redux store first
2. Falls back to localStorage if Redux not available
3. Automatically dispatches logout on 401 errors

## Testing

### Check Redux State

```javascript
import {store} from '../store/store';

const state = store.getState();
console.log('User:', state.auth.user);
console.log('Token:', state.auth.token);
console.log('Authenticated:', state.auth.isAuthenticated);
```

### Check LocalStorage

```javascript
// In browser console
localStorage.getItem('meditrack_user');
localStorage.getItem('meditrack_token');
```

### Verify Sync

1. Login to app
2. Check Redux DevTools - user should be in state
3. Check localStorage - user should be stored
4. Refresh page - user should load from localStorage
5. Update user - both Redux and localStorage should update

## Troubleshooting

### User not persisting

- Check localStorage in browser DevTools
- Verify middleware is working (check Redux DevTools)
- Check for localStorage errors in console

### User not loading on refresh

- Verify token exists in localStorage
- Check `loadUser()` is being called in `App.js`
- Check network tab for API errors

### State out of sync

- Clear localStorage and login again
- Check middleware is properly configured
- Verify actions are using correct reducers

## Files Reference

- **Redux Store**: `frontend/src/store/store.js`
- **Auth Slice**: `frontend/src/store/slices/authSlice.js`
- **Middleware**: `frontend/src/store/middleware/localStorageMiddleware.js`
- **Hooks**: `frontend/src/store/hooks.js`
- **LocalStorage Utils**: `frontend/src/utils/localStorage.js`
- **User Storage Utils**: `frontend/src/utils/userStorage.js`

## Summary

✅ User data stored in **Redux global state**  
✅ User data persisted to **localStorage**  
✅ **Automatic synchronization** between Redux and localStorage  
✅ **Easy access** via `useAuth()` hook  
✅ **Utility functions** for non-component access  
✅ **Error handling** and backward compatibility  

User information is now fully managed through Redux with automatic localStorage persistence! 🎉


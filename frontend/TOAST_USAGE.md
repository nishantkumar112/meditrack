# Toast Notification System

## Overview

The application now includes a toast notification system that automatically displays success and error messages for API operations. Toasts appear in the top-right corner of the screen.

## Features

- **Automatic Notifications**: API success/error messages are shown automatically
- **Multiple Types**: Success, Error, Warning, and Info toasts
- **Auto-dismiss**: Toasts automatically disappear after 5 seconds (configurable)
- **Manual Dismiss**: Users can close toasts by clicking the X button
- **Stacked Display**: Multiple toasts stack vertically
- **Smooth Animations**: Slide-in animation from the right

## Toast Types

1. **Success** (Green) - For successful operations
2. **Error** (Red) - For errors and failures
3. **Warning** (Yellow) - For warnings
4. **Info** (Blue) - For informational messages

## Automatic Toast Display

The API interceptor automatically shows toasts for:
- **Success responses** with messages from the backend
- **Error responses** with error messages
- **POST/PUT/DELETE operations** (generic success messages if no specific message)

## Manual Usage

You can also manually show toasts in your components:

```javascript
import {useToast} from '../context/ToastContext';

function MyComponent() {
  const {showSuccess, showError, showWarning, showInfo} = useToast();

  const handleAction = async () => {
    try {
      await someAPI.call();
      showSuccess('Operation completed successfully!');
    } catch (error) {
      showError('Operation failed. Please try again.');
    }
  };

  return (
    <button onClick={handleAction}>
      Perform Action
    </button>
  );
}
```

## Toast Methods

- `showSuccess(message, duration?)` - Show success toast
- `showError(message, duration?)` - Show error toast
- `showWarning(message, duration?)` - Show warning toast
- `showInfo(message, duration?)` - Show info toast

### Parameters

- `message` (string, required) - The message to display
- `duration` (number, optional) - Duration in milliseconds (default: 5000). Set to 0 for no auto-dismiss.

## Examples

### Success Toast
```javascript
showSuccess('Medication created successfully!');
```

### Error Toast
```javascript
showError('Failed to save medication. Please check your input.');
```

### Warning Toast
```javascript
showWarning('This action cannot be undone.');
```

### Info Toast
```javascript
showInfo('Your profile has been updated.');
```

### Custom Duration
```javascript
showSuccess('Saved!', 3000); // Disappears after 3 seconds
showError('Error occurred!', 0); // Stays until manually closed
```

## Styling

Toasts are styled with Tailwind CSS:
- **Success**: Green background with checkmark icon
- **Error**: Red background with X icon
- **Warning**: Yellow background with warning icon
- **Info**: Blue background with info icon

## Position

Toasts appear in the **top-right corner** of the screen with:
- Fixed positioning
- High z-index (z-50) to appear above all content
- Responsive spacing
- Stacked vertically with spacing

## Integration

The toast system is integrated into:
- ✅ API interceptor (automatic success/error messages)
- ✅ All form submissions
- ✅ All CRUD operations
- ✅ Authentication flows

## Customization

To customize toast appearance, edit:
- `frontend/src/components/Toast.js` - Individual toast styling
- `frontend/src/components/ToastContainer.js` - Container positioning
- `frontend/src/index.css` - Animation styles


# Assets Directory

This directory contains static assets for the React Native app:

- `fonts/` - Custom fonts (if any)
- `images/` - Images and icons
- `icons/` - App icons and UI icons

## Usage

Import assets in your components:

```javascript
// For images
import logo from '../assets/images/logo.png';

// For fonts (if using react-native-vector-icons)
// Fonts are automatically linked when added to this directory
```

## Adding New Assets

1. Place your assets in the appropriate subdirectory
2. For fonts, ensure they're in the `fonts/` directory
3. For images, use the `images/` directory
4. Update `react-native.config.js` if adding new font directories
# FeedbackApp - React Native

A cross-platform feedback application for food delivery services, built with React Native for Android, iOS, and Web.

## Features

- **Cross-platform**: Works on Android, iOS, and Web
- **Order Management**: View and manage food delivery orders
- **Feedback System**: Rate individual food items and delivery service
- **Real-time Updates**: Fetch orders from API and submit feedback
- **Modern UI**: Clean, responsive design with native feel

## Prerequisites

- Node.js (>= 16)
- npm or yarn
- For Android: Android Studio, Android SDK
- For iOS: Xcode (macOS only)
- For Web: Modern web browser

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd feedbackapp-react-native
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install React Native CLI globally** (if not already installed)
   ```bash
   npm install -g @react-native-community/cli
   ```

## Running the App

### Web Development
```bash
npm run web
# or
yarn web
```
The app will open in your browser at `http://localhost:3000`

### Android Development
```bash
# Start Metro bundler
npm start

# In another terminal, run Android app
npm run android
# or
yarn android
```

### iOS Development (macOS only)
```bash
# Start Metro bundler
npm start

# In another terminal, run iOS app
npm run ios
# or
yarn ios
```

## Project Structure

```
src/
├── App.js                 # Main application component
├── components/
│   └── FeedbackModal.js   # Feedback form modal component
├── assets/                # Images, fonts, and other assets
└── index.js              # Web entry point

android/                   # Android-specific configuration
ios/                      # iOS-specific configuration
public/                   # Web-specific files
```

## API Configuration

The app connects to a food delivery API. You can configure the API endpoint in `src/App.js`:

```javascript
// For local development
const baseUrl = 'http://localhost:3000/orders/';

// For production
const baseUrl = 'https://food-delivery-api.herokuapp.com/orders/';
```

## Building for Production

### Web
```bash
npm run build
```
This creates an optimized production build in the `build/` directory.

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
Open the project in Xcode and use Product > Archive to create a release build.

## Key Features Migrated from Vue.js

- ✅ Order listing with feedback status
- ✅ Modal-based feedback form
- ✅ Rating system (Good/Bad) for food items and delivery
- ✅ Comment system for detailed feedback
- ✅ API integration for fetching orders and submitting feedback
- ✅ Responsive design for mobile and web
- ✅ Cross-platform compatibility

## Technologies Used

- **React Native**: Cross-platform mobile development
- **React Native Web**: Web support
- **React Native Modal**: Modal dialogs
- **Fetch API**: HTTP requests
- **Async/Await**: Modern JavaScript for API calls

## Development Notes

- The app uses the same API endpoints as the original Vue.js version
- All functionality has been preserved and enhanced for mobile use
- The UI has been adapted for touch interfaces while maintaining web compatibility
- Error handling and loading states are implemented throughout

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **Android build issues**: Clean project with `cd android && ./gradlew clean`
3. **iOS build issues**: Clean build folder in Xcode (Product > Clean Build Folder)
4. **Web build issues**: Clear node_modules and reinstall dependencies

### Platform-Specific Setup

#### Android
- Ensure Android Studio is properly configured
- Set up Android SDK and environment variables
- Create an Android Virtual Device (AVD) for testing

#### iOS
- Install Xcode from the Mac App Store
- Install iOS Simulator
- Accept Xcode license agreements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on all platforms
5. Submit a pull request

## License

This project is licensed under the MIT License.

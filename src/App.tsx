import { useEffect } from 'react';
import {
  AppState,
  AppStateStatus,
  StatusBar,
  Text,
  // TouchableOpacity,
  useColorScheme,
} from 'react-native';
import 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';
import { Provider } from 'react-redux';
import '../global.css';
// import { AuthService } from './services/auth/authService';
// import { FirebaseService } from './services/firebase/firebaseService';

import { AppNavigator } from './navigators/AppNavigator';
import { NetworkService } from './services/network/networkService';
import { store } from './store/store';
import './translations';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from './components/Toast/ToastProvider';
import { useAppIntro } from './hooks/useAppIntro';
import { useSplashScreen } from './hooks/useSplashScreen';
import OnboardingSlider from './screens/AppIntro/OnboardingSlider';
import SplashScreen from './screens/SplashScreen';

export const storage = new MMKV();

// Initialize services
const initializeServices = async () => {
  try {
    // Configure Google Sign-In
    // await AuthService.configureGoogleSignIn();

    // Initialize Firebase
    // const firebaseService = FirebaseService.getInstance();
    // await firebaseService.initialize();

    // Initialize Network Service
    const networkService = NetworkService.getInstance();
    await networkService.initialize();

    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Service initialization failed:', error);
  }
};

function App() {
  const { isFirstLaunch, isLoading: introLoading, resetIntro, markIntroAsShown } = useAppIntro();
  const { isSplashVisible, hideSplash, isReady } = useSplashScreen();

  const isDarkMode = useColorScheme() === 'dark';

  const handleIntroComplete = async () => {
    try {
      await markIntroAsShown();
    } catch (error) {
      console.error('Failed to mark intro as complete:', error);
    }
  };

  const handleShowIntroAgain = async () => {
    try {
      await resetIntro();
    } catch (error) {
      console.error('Failed to reset intro:', error);
    }
  };

  useEffect(() => {
    // Handle app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('App state changed to:', nextAppState);

      if (nextAppState === 'active') {
        // App became active, check for updates, sync data, etc.
      } else if (nextAppState === 'background') {
        // App went to background, save state, pause timers, etc.
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeServices();
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log('BootSplash has been hidden successfully');
    });
  }, []);

  // Show loading screen while checking first launch status
  if (introLoading) {
    // return <LoadingScreen />;
    return <Text>Loading</Text>;
  }
  if (isSplashVisible || !isReady) {
    return (
      <SafeAreaProvider>
        <SplashScreen
          onAnimationEnd={hideSplash}
          showLogo={true}
          logoSource={'https://unsplash.com/photos/silver-mercedes-benz-emblem-on-blue-surface-5MlBMYDsGBY'}
          // logoSource={require('./src/assets/logo.png')}
          backgroundColor='#FFFFFF'
          logoSize={120}
          animationDuration={2000}
          appName='Our Little Nest'
          version='1.0.0'
        />
      </SafeAreaProvider>
    );
  }

  // // Show intro screens for first-time users
  if (isFirstLaunch) {
    return <OnboardingSlider onDone={handleIntroComplete} />;
  }

  return (
    <Provider store={store}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} translucent backgroundColor={'transparent'} />

      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ToastProvider>
            <AppNavigator />
          </ToastProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;

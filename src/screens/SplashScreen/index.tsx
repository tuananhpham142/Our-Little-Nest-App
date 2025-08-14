// SplashScreen.tsx
import React, { useCallback, useEffect } from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SplashScreenProps {
  onAnimationEnd?: () => void;
  showLogo?: boolean;
  logoSource?: any;
  backgroundColor?: string;
  logoSize?: number;
  animationDuration?: number;
  appName?: string;
  version?: string;
}

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationEnd,
  showLogo = true,
  logoSource,
  backgroundColor = '#FFFFFF',
  logoSize = 120,
  animationDuration = 2000,
  appName,
  version,
}) => {
  const insets = useSafeAreaInsets();

  //   const simulateAsyncOperation = (operation: string, duration: number): Promise<void> => {
  //     return new Promise((resolve) => {
  //       console.log(`Starting: ${operation}`);
  //       setTimeout(() => {
  //         console.log(`Completed: ${operation}`);
  //         resolve();
  //       }, duration);
  //     });
  //   };

  const hideSplash = useCallback(async () => {
    try {
      // Hide the native splash screen with animation
      await BootSplash.hide({ fade: true });

      // Add artificial delay if needed for branding
      if (animationDuration > 0) {
        setTimeout(() => {
          onAnimationEnd?.();
        }, animationDuration);
      } else {
        onAnimationEnd?.();
      }
    } catch (error) {
      console.warn('Error hiding splash screen:', error);
      // Fallback: still call onAnimationEnd even if there's an error
      onAnimationEnd?.();
    }
  }, [onAnimationEnd, animationDuration]);

  useEffect(() => {
    // Initialize splash screen logic
    const initializeSplash = async () => {
      try {
        // Check if splash screen is visible
        const isVisible = await BootSplash.isVisible();

        if (isVisible) {
          // Minimum display time for better UX
          const minDisplayTime = 1500;
          const startTime = Date.now();

          // Simulate app initialization (replace with actual initialization)
          await initializeApp();

          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

          // Ensure minimum display time
          setTimeout(hideSplash, remainingTime);
        } else {
          // Splash already hidden, proceed immediately
          onAnimationEnd?.();
        }
      } catch (error) {
        console.error('Splash screen initialization error:', error);
        // Fallback: hide splash after delay
        setTimeout(hideSplash, 1000);
      }
    };

    initializeSplash();
  }, [hideSplash, onAnimationEnd]);

  // Simulate app initialization (replace with your actual initialization logic)
  const initializeApp = async (): Promise<void> => {
    try {
      // Add your app initialization logic here
      // Examples:
      // - Check authentication status
      // - Load cached data
      // - Initialize services
      // - Setup analytics
      // - Load configurations

      await Promise.all([
        // simulateAsyncOperation('Loading user preferences', 3000),
        // simulateAsyncOperation('Initializing services', 5000),
        // simulateAsyncOperation('Loading cached data', 2000),
      ]);
    } catch (error) {
      console.error('App initialization error:', error);
      // Continue anyway - don't block the app from starting
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={backgroundColor === '#FFFFFF' ? 'dark-content' : 'light-content'}
        translucent={Platform.OS === 'android'}
      />

      <View style={[styles.content, { paddingTop: insets.top }]}>
        {showLogo && logoSource && (
          <View style={styles.logoContainer}>
            <Image
              source={logoSource}
              style={[
                styles.logo,
                {
                  width: logoSize,
                  height: logoSize,
                },
              ]}
              resizeMode='contain'
            />
          </View>
        )}

        {appName && <Text style={styles.appName}>{appName}</Text>}

        {version && <Text style={styles.version}>v{version}</Text>}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        {/* Add loading indicator or footer content here */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            {/* <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} /> */}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginTop: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  version: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginHorizontal: 4,
  },
  //   dot1: {
  //     animationDelay: '0ms',
  //   },
  //   dot2: {
  //     animationDelay: '150ms',
  //   },
  //   dot3: {
  //     animationDelay: '300ms',
  //   },
});

export default SplashScreen;

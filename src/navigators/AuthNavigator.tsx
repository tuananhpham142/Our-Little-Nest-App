// src/navigation/AuthNavigator.tsx
import CompleteProfileScreen from '@/screens/Auth/CompleteProfileScreen';
import LoginScreen from '@/screens/Auth/LoginScreen';
import OTPVerificationScreen from '@/screens/Auth/OTPVerificationScreen';
import RegisterScreen from '@/screens/Auth/RegisterScreen';
import ThankYouScreen from '@/screens/Auth/ThankyouScreen';
import WelcomeScreen from '@/screens/WelcomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { AuthStackParamList } from '../types/navigation';

// Import your auth screens here

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName='Welcome'
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
          },
        }),
      }}
    >
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='ThankyouRegister' component={ThankYouScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
      <Stack.Screen name='OTPVerification' component={OTPVerificationScreen} />
      <Stack.Screen name='CompleteProfile' component={CompleteProfileScreen} />
      {/* <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
};

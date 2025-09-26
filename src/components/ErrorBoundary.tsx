// src/components/common/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className='flex-1 justify-center items-center p-6 bg-white'>
          <Text className='text-xl font-bold text-red-600 mb-4 text-center'>Something went wrong</Text>
          <Text className='text-gray-600 text-center mb-6'>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity className='bg-blue-500 px-4 py-3 rounded-lg' onPress={this.handleReset}>
            <Text className='text-white font-semibold'>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

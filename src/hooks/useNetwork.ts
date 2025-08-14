// src/utils/hooks/useNetwork.ts
import { NetworkService } from '@/services/network/networkService';
import { setNetworkState } from '@/store/slices/appSlice';
import { NetworkState } from '@/types/app';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export const useNetwork = () => {
  const dispatch = useDispatch();
  const [networkState, setNetworkStateLocal] = useState<NetworkState>({
    isConnected: true,
    type: null,
    isInternetReachable: null,
  });

  useEffect(() => {
    const networkService = NetworkService.getInstance();

    // Initialize network service
    networkService.initialize().catch(console.error);

    // Get initial state
    const initialState = networkService.getCurrentState();
    setNetworkStateLocal(initialState);
    dispatch(setNetworkState(initialState));

    // Listen for network changes
    const unsubscribe = networkService.addListener((state) => {
      setNetworkStateLocal(state);
      dispatch(setNetworkState(state));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  const checkConnectivity = async () => {
    try {
      const networkService = NetworkService.getInstance();
      const isReachable = await networkService.checkInternetConnectivity();
      return isReachable;
    } catch (error) {
      console.error('Connectivity check failed:', error);
      return false;
    }
  };

  const waitForConnection = async (timeout = 10000) => {
    try {
      const networkService = NetworkService.getInstance();
      return await networkService.waitForConnection(timeout);
    } catch (error) {
      console.error('Wait for connection failed:', error);
      return false;
    }
  };

  return {
    ...networkState,
    checkConnectivity,
    waitForConnection,
    isOnline: networkState.isConnected,
    isWiFi: networkState.type === 'wifi',
    isCellular: networkState.type === 'cellular',
  };
};

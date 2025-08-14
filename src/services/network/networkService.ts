// src/services/network/NetworkService.ts
import { NetworkState } from '@/types/app';
import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

export class NetworkService {
  private static instance: NetworkService;
  private subscription: NetInfoSubscription | null = null;
  private listeners: ((state: NetworkState) => void)[] = [];
  private currentState: NetworkState = {
    isConnected: true,
    type: null,
    isInternetReachable: null,
  };

  static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  /**
   * Initialize network monitoring
   */
  async initialize(): Promise<void> {
    try {
      // Get current network state
      const netInfoState = await NetInfo.fetch();
      this.updateNetworkState(netInfoState);

      // Subscribe to network state changes
      this.subscription = NetInfo.addEventListener((state) => {
        this.updateNetworkState(state);
      });

      console.log('Network service initialized');
    } catch (error) {
      console.error('Network service initialization failed:', error);
      throw error;
    }
  }

  /**
   * Get current network state
   */
  getCurrentState(): NetworkState {
    return this.currentState;
  }

  /**
   * Check if device is online
   */
  isOnline(): boolean {
    return this.currentState.isConnected;
  }

  /**
   * Check if internet is reachable
   */
  isInternetReachable(): boolean | null {
    return this.currentState.isInternetReachable;
  }

  /**
   * Get connection type
   */
  getConnectionType(): string | null {
    return this.currentState.type;
  }

  /**
   * Add network state listener
   */
  addListener(listener: (state: NetworkState) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners = [];
  }

  /**
   * Force refresh network state
   */
  async refresh(): Promise<NetworkState> {
    try {
      const netInfoState = await NetInfo.fetch();
      this.updateNetworkState(netInfoState);
      return this.currentState;
    } catch (error) {
      console.error('Failed to refresh network state:', error);
      throw error;
    }
  }

  /**
   * Check internet connectivity with custom endpoint
   */
  async checkInternetConnectivity(url?: string): Promise<boolean> {
    try {
      const testUrl = url || 'https://www.google.com';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(testUrl, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('Internet connectivity check failed:', error);
      return false;
    }
  }

  /**
   * Get detailed network information
   */
  async getDetailedNetworkInfo(): Promise<NetInfoState> {
    return await NetInfo.fetch();
  }

  /**
   * Check if connection is expensive (mobile data)
   */
  isExpensiveConnection(): boolean {
    return this.currentState.type === 'cellular';
  }

  /**
   * Check if connection is WiFi
   */
  isWiFiConnection(): boolean {
    return this.currentState.type === 'wifi';
  }

  /**
   * Update network state and notify listeners
   */
  private updateNetworkState(netInfoState: NetInfoState): void {
    const newState: NetworkState = {
      isConnected: netInfoState.isConnected ?? false,
      type: netInfoState.type,
      isInternetReachable: netInfoState.isInternetReachable,
    };

    // Check if state has changed
    const hasChanged =
      this.currentState.isConnected !== newState.isConnected ||
      this.currentState.type !== newState.type ||
      this.currentState.isInternetReachable !== newState.isInternetReachable;

    if (hasChanged) {
      this.currentState = newState;

      // Notify all listeners
      this.listeners.forEach((listener) => {
        try {
          listener(newState);
        } catch (error) {
          console.error('Network listener error:', error);
        }
      });

      console.log('Network state updated:', newState);
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.subscription) {
      this.subscription();
      this.subscription = null;
    }
    this.removeAllListeners();
  }

  /**
   * Wait for internet connection
   */
  waitForConnection(timeout = 10000): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isOnline()) {
        resolve(true);
        return;
      }

      const timeoutId = setTimeout(() => {
        unsubscribe();
        reject(new Error('Connection timeout'));
      }, timeout);

      const unsubscribe = this.addListener((state) => {
        if (state.isConnected) {
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(true);
        }
      });
    });
  }
}

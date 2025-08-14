// src/types/app.ts
export interface AppState {
  isOnline: boolean;
  isAppInForeground: boolean;
  deviceToken: string | null;
  lastSyncTime: string | null;
  appVersion: string;
  buildNumber: string;
}

export interface NetworkState {
  isConnected: boolean;
  type: string | null;
  isInternetReachable: boolean | null;
}

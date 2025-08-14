import { AppState, NetworkState } from '@/types/app';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import DeviceInfo from 'react-native-device-info';
import { FirebaseService } from '../../services/firebase/firebaseService';

const initialState: AppState = {
  isOnline: true,
  isAppInForeground: true,
  deviceToken: null,
  lastSyncTime: null,
  appVersion: '',
  buildNumber: '',
};

// Async thunks
export const initializeApp = createAsyncThunk('app/initialize', async (_, {  }) => {
  try {
    const appVersion = DeviceInfo.getVersion();
    const buildNumber = DeviceInfo.getBuildNumber();
    const deviceToken = await FirebaseService.getDeviceToken();

    return {
      appVersion,
      buildNumber,
      deviceToken,
    };
  } catch (error) {
    console.error('App initialization failed:', error);
    throw error;
  }
});

export const updateDeviceToken = createAsyncThunk('app/updateDeviceToken', async (userId?: string) => {
  try {
    const deviceToken = await FirebaseService.getDeviceToken();
    if (deviceToken && userId) {
      await FirebaseService.registerDeviceToken(deviceToken, userId);
    }
    return deviceToken;
  } catch (error) {
    console.error('Device token update failed:', error);
    throw error;
  }
});

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setNetworkState: (state, action: PayloadAction<NetworkState>) => {
      state.isOnline = action.payload.isConnected;
    },
    setAppForegroundState: (state, action: PayloadAction<boolean>) => {
      state.isAppInForeground = action.payload;
    },
    setLastSyncTime: (state, action: PayloadAction<string>) => {
      state.lastSyncTime = action.payload;
    },
    setDeviceToken: (state, action: PayloadAction<string>) => {
      state.deviceToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.appVersion = action.payload.appVersion;
        state.buildNumber = action.payload.buildNumber;
        state.deviceToken = action.payload.deviceToken;
      })
      .addCase(updateDeviceToken.fulfilled, (state, action) => {
        state.deviceToken = action.payload;
      });
  },
});

export const { setNetworkState, setAppForegroundState, setLastSyncTime, setDeviceToken } = appSlice.actions;
export default appSlice.reducer;

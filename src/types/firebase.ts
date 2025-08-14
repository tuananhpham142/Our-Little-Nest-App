// src/types/firebase.ts
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: { [key: string]: any };
}

export interface DeviceTokenPayload {
  deviceToken: string;
  platform: 'ios' | 'android';
  userId?: string;
}

// ==================== Toast Types ====================
// src/contexts/Toast/types.ts

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'notification';

export interface ToastConfig {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  icon?: string;
  image?: string;
  onPress?: () => void;
  timestamp?: Date;
}

export interface ToastContextValue {
  showToast: (config: Omit<ToastConfig, 'id' | 'timestamp'>) => void;
  hideToast: (id: string) => void;
  showNotification: (title: string, message: string, onPress?: () => void, image?: string) => void;
  clearAll: () => void;
}

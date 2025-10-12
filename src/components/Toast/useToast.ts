// ==================== useToast Hook ====================
// src/contexts/Toast/useToast.ts

import { useContext } from 'react';
import { ToastContext } from './ToastProvider';

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};

// ==================== Usage Examples ====================

/*
// Basic Toast
showToast({
  type: 'success',
  title: 'Hoàn thành!',
  message: 'Đã lưu thông tin bé yêu thành công',
});

// Notification with Image
showNotification(
  'Bác sĩ Nguyễn Văn A',
  'Đã trả lời câu hỏi của bạn về dinh dưỡng cho bé',
  () => navigation.navigate('Messages'),
  'https://example.com/doctor-avatar.jpg'
);

// Error Toast
showToast({
  type: 'error',
  title: 'Lỗi kết nối',
  message: 'Không thể tải dữ liệu. Vui lòng thử lại sau',
});

// Warning
showToast({
  type: 'warning',
  title: 'Cảnh báo',
  message: 'Lịch tiêm chủng sắp đến hạn',
  onPress: () => navigation.navigate('Vaccination'),
});

// Info
showToast({
  type: 'info',
  message: 'Đã cập nhật phiên bản mới',
});

// Clear all notifications
clearAll();
*/

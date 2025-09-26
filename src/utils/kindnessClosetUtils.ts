// src/utils/kindnessCloset/kindnessClosetUtils.ts

import {
    KindnessCloset
} from '@/models/KindnessCloset/KindnessClosetModel';
import { Location } from '@/models/Location/LocationModel';
import { User } from '@/models/User/UserModel';

/**
 * Type guards to check if data is populated or just an ID
 */
export const isPopulatedUser = (data: User | string): data is User => {
  return typeof data === 'object' && data !== null && 'email' in data;
};

export const isPopulatedLocation = (data: Location | string): data is Location => {
  return typeof data === 'object' && data !== null && 'city' in data;
};

export const isPopulatedPost = (data: KindnessCloset | string): data is KindnessCloset => {
  return typeof data === 'object' && data !== null && 'title' in data;
};

/**
 * Helper to get user info safely
 */
export const getUserInfo = (user: User | string): { name: string; id: string } => {
  if (isPopulatedUser(user)) {
    const name =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || 'Unknown User';
    return { name, id: user.id || user._id || '' };
  }
  return { name: 'Unknown User', id: user as string };
};

/**
 * Helper to get location info safely
 */
export const getLocationInfo = (location: Location | string): { address: string; id: string } => {
  if (isPopulatedLocation(location)) {
    const parts = [];
    if (location.ward) parts.push(location.ward);
    if (location.district) parts.push(location.district);
    if (location.city) parts.push(location.city);
    const address = parts.length > 0 ? parts.join(', ') : 'Unknown Location';
    return { address, id: location.id || location._id || '' };
  }
  return { address: 'Unknown Location', id: location as string };
};

/**
 * Helper to get post info safely
 */
export const getPostInfo = (post: KindnessCloset | string): { title: string; id: string } => {
  if (isPopulatedPost(post)) {
    return { title: post.title, id: post.id || post._id || '' };
  }
  return { title: 'Unknown Post', id: post as string };
};

/**
 * Transform MongoDB _id to id for consistent frontend usage
 */
export const normalizeId = <T extends { _id?: string; id?: string }>(item: T): T => {
  if (item._id && !item.id) {
    return { ...item, id: item._id };
  }
  return item;
};

/**
 * Normalize array of items with MongoDB _id
 */
export const normalizeIds = <T extends { _id?: string; id?: string }>(items: T[]): T[] => {
  return items.map(normalizeId);
};

/**
 * Format date string to user-friendly format
 */
export const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'Unknown date';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Get age display string
 */
export const getAgeDisplay = (ageFrom?: number, ageTo?: number, ageUnit?: string): string => {
  if (!ageFrom && !ageTo) return 'Mọi lứa tuổi';

  const unit = ageUnit === 'week' ? 'tuần' : 'tháng';

  if (ageFrom === ageTo) {
    return `${ageFrom} ${unit}`;
  }

  if (ageFrom && ageTo) {
    return `${ageFrom} - ${ageTo} ${unit}`;
  }

  if (ageFrom) {
    return `Từ ${ageFrom} ${unit}`;
  }

  return `Đến ${ageTo} ${unit}`;
};

/**
 * Get gender display string
 */
export const getGenderDisplay = (gender?: string): string => {
  switch (gender) {
    case 'male':
      return 'Bé trai';
    case 'female':
      return 'Bé gái';
    case 'both':
      return 'Cả hai';
    default:
      return 'Không xác định';
  }
};

/**
 * Get status display string
 */
export const getStatusDisplay = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Đang hoạt động';
    case 'completed':
      return 'Đã hoàn thành';
    case 'expired':
      return 'Đã hết hạn';
    case 'cancelled':
      return 'Đã hủy';
    case 'pending':
      return 'Đang chờ';
    case 'approved':
      return 'Đã duyệt';
    case 'rejected':
      return 'Đã từ chối';
    default:
      return status;
  }
};

/**
 * Get type display string
 */
export const getTypeDisplay = (type: string): string => {
  switch (type) {
    case 'giving':
      return 'Cho tặng';
    case 'recipients':
      return 'Cần hỗ trợ';
    default:
      return type;
  }
};

/**
 * Calculate distance between two coordinates
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

/**
 * Check if post can be edited
 */
export const canEditPost = (post: KindnessCloset, userId: string): boolean => {
  const postUserId = isPopulatedUser(post.user) ? post.user.id || post.user._id : post.user;

  return post.status === 'active' && postUserId === userId;
};

/**
 * Check if post can be deleted
 */
export const canDeletePost = (post: KindnessCloset, userId: string): boolean => {
  const postUserId = isPopulatedUser(post.user) ? post.user.id || post.user._id : post.user;

  return post.status !== 'completed' && postUserId === userId;
};

/**
 * Check if user can apply to post
 */
export const canApplyToPost = (post: KindnessCloset, userId: string): boolean => {
  const postUserId = isPopulatedUser(post.user) ? post.user.id || post.user._id : post.user;

  return post.status === 'active' && postUserId !== userId;
};

/**
 * Validate phone number (Vietnamese format)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

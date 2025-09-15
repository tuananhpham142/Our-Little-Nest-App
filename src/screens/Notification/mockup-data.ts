// src/mocks/notificationMockData.ts

import {
    NotificationChannelEnum,
    NotificationPriorityEnum,
    NotificationStatusEnum,
    NotificationTypeEnum,
} from '@/models/Notification/NotificationEnum';
import { Notification, NotificationPreferences, NotificationStatistics } from '@/models/Notification/NotificationModel';
import { subDays, subHours, subMinutes } from 'date-fns';

// Helper function to generate dates
const getDate = (daysAgo: number = 0, hoursAgo: number = 0, minutesAgo: number = 0): string => {
  let date = new Date();
  if (daysAgo) date = subDays(date, daysAgo);
  if (hoursAgo) date = subHours(date, hoursAgo);
  if (minutesAgo) date = subMinutes(date, minutesAgo);
  return date.toISOString();
};

// Sample Notifications Data
export const mockNotifications: Notification[] = [
  // Today - Unread Urgent
  {
    id: '1',
    userId: 'user123',
    type: NotificationTypeEnum.DOCTOR_APPOINTMENT,
    title: 'Appointment Reminder',
    message: 'Doctor appointment today at 6:30pm, need to pick up files on the way.',
    status: NotificationStatusEnum.SENT,
    priority: NotificationPriorityEnum.URGENT,
    channels: [NotificationChannelEnum.PUSH, NotificationChannelEnum.IN_APP],
    data: {
      appointmentId: 'apt-001',
      doctorName: 'Dr. Sarah Johnson',
      location: "Children's Medical Center",
      time: '6:30 PM',
      actionText: 'View Details',
    },
    createdAt: getDate(0, 0, 23),
    updatedAt: getDate(0, 0, 23),
  },

  // Today - Unread High Priority
  {
    id: '2',
    userId: 'user123',
    type: NotificationTypeEnum.VACCINATION_REMINDER,
    title: 'Vaccination Due',
    message: "Your baby's MMR vaccination is due tomorrow. Please schedule an appointment.",
    status: NotificationStatusEnum.SENT,
    priority: NotificationPriorityEnum.HIGH,
    channels: [NotificationChannelEnum.PUSH, NotificationChannelEnum.EMAIL],
    data: {
      babyId: 'baby-001',
      vaccineName: 'MMR',
      dueDate: 'Tomorrow',
      actionText: 'Schedule Now',
    },
    createdAt: getDate(0, 2),
    updatedAt: getDate(0, 2),
  },

  // Today - Read
  {
    id: '3',
    userId: 'user123',
    type: NotificationTypeEnum.GROWTH_UPDATE,
    title: 'Your weekly health tip is ready!',
    message: "We've prepared your weekly health tip to help you improve your mood.",
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.NORMAL,
    channels: [NotificationChannelEnum.IN_APP],
    data: {
      tipId: 'tip-001',
      category: 'Mental Health',
      actionText: 'Open weekly tips',
    },
    readAt: getDate(0, 1),
    createdAt: getDate(0, 2, 30),
    updatedAt: getDate(0, 1),
  },

  // Today - Weight Tracking
  {
    id: '4',
    userId: 'user123',
    type: NotificationTypeEnum.GENERAL_REMINDER,
    title: "It's time to enter your weight",
    message: 'Track your weight and help us customize your weekly health tip for you.',
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.NORMAL,
    channels: [NotificationChannelEnum.PUSH],
    data: {
      reminderType: 'weight_tracking',
      actionText: 'Add weight entry',
    },
    readAt: getDate(0, 3),
    createdAt: getDate(0, 5),
    updatedAt: getDate(0, 3),
  },

  // Yesterday - Milestone
  {
    id: '5',
    userId: 'user123',
    type: NotificationTypeEnum.MILESTONE_ACHIEVED,
    title: 'Milestone Achieved! 🎉',
    message: 'Emma just reached a new milestone: First Steps! Capture this moment.',
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.NORMAL,
    channels: [NotificationChannelEnum.PUSH, NotificationChannelEnum.IN_APP],
    data: {
      milestoneId: 'milestone-001',
      babyName: 'Emma',
      milestoneName: 'First Steps',
      actionText: 'Add Photo',
    },
    readAt: getDate(1, 2),
    createdAt: getDate(1, 8),
    updatedAt: getDate(1, 2),
  },

  // Yesterday - Kindness Closet
  {
    id: '6',
    userId: 'user123',
    type: NotificationTypeEnum.KINDNESS_CLOSET_CREATED,
    title: 'New Items in Kindness Closet',
    message: 'Baby clothes (6-12 months) available near you in Brooklyn area.',
    status: NotificationStatusEnum.SENT,
    priority: NotificationPriorityEnum.LOW,
    channels: [NotificationChannelEnum.IN_APP],
    data: {
      postId: 'kc-001',
      itemType: 'Baby Clothes',
      size: '6-12 months',
      location: 'Brooklyn',
      distance: '2.3 miles',
      actionText: 'View Items',
    },
    createdAt: getDate(1, 10),
    updatedAt: getDate(1, 10),
  },

  // Yesterday - Medication Reminder
  {
    id: '7',
    userId: 'user123',
    type: NotificationTypeEnum.MEDICATION_REMINDER,
    title: 'Medication Reminder',
    message: "Time for Emma's evening dose of Vitamin D drops.",
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.HIGH,
    channels: [NotificationChannelEnum.PUSH],
    data: {
      medicationName: 'Vitamin D',
      dosage: '1 drop',
      time: '7:00 PM',
      actionText: 'Mark as Given',
    },
    readAt: getDate(1, 14),
    createdAt: getDate(1, 14),
    updatedAt: getDate(1, 14),
  },

  // 2 days ago - Doctor Visit
  {
    id: '8',
    userId: 'user123',
    type: NotificationTypeEnum.MEDICAL_VISIT_RECORDED,
    title: 'Medical Visit Summary',
    message: "Summary from yesterday's pediatric visit is now available.",
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.NORMAL,
    channels: [NotificationChannelEnum.EMAIL, NotificationChannelEnum.IN_APP],
    data: {
      visitId: 'visit-001',
      doctorName: 'Dr. Michael Chen',
      visitType: 'Regular Checkup',
      actionText: 'View Summary',
    },
    readAt: getDate(2, 5),
    createdAt: getDate(2, 6),
    updatedAt: getDate(2, 5),
  },

  // 3 days ago - Birthday Reminder
  {
    id: '9',
    userId: 'user123',
    type: NotificationTypeEnum.BIRTHDAY_REMINDER,
    title: 'Birthday Coming Up!',
    message: "Emma's 1st birthday is in 2 weeks! Time to plan the celebration.",
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.NORMAL,
    channels: [NotificationChannelEnum.PUSH],
    data: {
      babyName: 'Emma',
      birthDate: 'March 25',
      turningAge: 1,
      daysUntil: 14,
      actionText: 'Create Event',
    },
    readAt: getDate(3, 8),
    createdAt: getDate(3, 9),
    updatedAt: getDate(3, 8),
  },

  // This week - Application Status
  {
    id: '10',
    userId: 'user123',
    type: NotificationTypeEnum.APPLICATION_APPROVED,
    title: 'Application Approved',
    message: 'Your request for baby formula has been approved. Pick up details sent.',
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.HIGH,
    channels: [NotificationChannelEnum.PUSH, NotificationChannelEnum.EMAIL],
    data: {
      applicationId: 'app-001',
      itemRequested: 'Baby Formula',
      pickupLocation: 'Community Center',
      actionText: 'View Pickup Info',
    },
    readAt: getDate(4, 12),
    createdAt: getDate(4, 14),
    updatedAt: getDate(4, 12),
  },

  // This week - Growth Recording
  {
    id: '11',
    userId: 'user123',
    type: NotificationTypeEnum.GROWTH_RECORDED,
    title: 'Growth Chart Updated',
    message: "Emma's height and weight have been recorded. She's growing perfectly!",
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.LOW,
    channels: [NotificationChannelEnum.IN_APP],
    data: {
      babyName: 'Emma',
      height: '74 cm',
      weight: '9.2 kg',
      percentile: '75th',
      actionText: 'View Growth Chart',
    },
    readAt: getDate(5, 10),
    createdAt: getDate(5, 16),
    updatedAt: getDate(5, 10),
  },

  // Last week - Vaccination Completed
  {
    id: '12',
    userId: 'user123',
    type: NotificationTypeEnum.VACCINATION_RECORDED,
    title: 'Vaccination Recorded',
    message: 'Hepatitis B vaccination has been successfully recorded.',
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.NORMAL,
    channels: [NotificationChannelEnum.IN_APP],
    data: {
      vaccineName: 'Hepatitis B',
      dose: '3rd Dose',
      administeredBy: 'Dr. Johnson',
      actionText: 'View Record',
    },
    readAt: getDate(7, 8),
    createdAt: getDate(7, 10),
    updatedAt: getDate(7, 8),
  },

  // Last week - Family Member Added
  {
    id: '13',
    userId: 'user123',
    type: NotificationTypeEnum.FAMILY_MEMBER_ADDED,
    title: 'Family Member Added',
    message: "Grandma Sarah has been added to Emma's care team.",
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.NORMAL,
    channels: [NotificationChannelEnum.IN_APP],
    data: {
      memberName: 'Sarah Thompson',
      relationship: 'Grandmother',
      babyName: 'Emma',
      actionText: 'View Family',
    },
    readAt: getDate(8, 6),
    createdAt: getDate(8, 12),
    updatedAt: getDate(8, 6),
  },

  // 2 weeks ago - Prescription Reminder
  {
    id: '14',
    userId: 'user123',
    type: NotificationTypeEnum.PRESCRIPTION_REMINDER,
    title: 'Prescription Refill Needed',
    message: "Emma's antibiotic prescription needs a refill. Contact your pharmacy.",
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.HIGH,
    channels: [NotificationChannelEnum.PUSH, NotificationChannelEnum.SMS],
    data: {
      medicationName: 'Amoxicillin',
      prescriptionNumber: 'RX-12345',
      pharmacy: 'CVS Pharmacy',
      actionText: 'Call Pharmacy',
    },
    readAt: getDate(14, 4),
    createdAt: getDate(14, 8),
    updatedAt: getDate(14, 4),
  },

  // 2 weeks ago - Community Achievement
  {
    id: '15',
    userId: 'user123',
    type: NotificationTypeEnum.COMMUNITY_ACHIEVEMENT,
    title: 'Community Hero!',
    message: "You've helped 5 families this month through Kindness Closet. Thank you!",
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.LOW,
    channels: [NotificationChannelEnum.IN_APP],
    data: {
      achievementName: 'Community Hero',
      familiesHelped: 5,
      itemsShared: 23,
      actionText: 'View Impact',
    },
    readAt: getDate(15, 10),
    createdAt: getDate(15, 14),
    updatedAt: getDate(15, 10),
  },

  // Older - Health Record Update
  {
    id: '16',
    userId: 'user123',
    type: NotificationTypeEnum.HEALTH_RECORD_UPDATED,
    title: 'Health Records Updated',
    message: "Emma's immunization records have been updated by the clinic.",
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.NORMAL,
    channels: [NotificationChannelEnum.EMAIL],
    data: {
      recordType: 'Immunization',
      updatedBy: "Children's Clinic",
      actionText: 'Review Changes',
    },
    readAt: getDate(20, 8),
    createdAt: getDate(20, 12),
    updatedAt: getDate(20, 8),
  },

  // Older - Follow-up Reminder
  {
    id: '17',
    userId: 'user123',
    type: NotificationTypeEnum.FOLLOW_UP_REMINDER,
    title: 'Follow-up Appointment',
    message: "Don't forget to schedule Emma's 12-month developmental screening.",
    status: NotificationStatusEnum.READ,
    priority: NotificationPriorityEnum.NORMAL,
    channels: [NotificationChannelEnum.PUSH],
    data: {
      appointmentType: 'Developmental Screening',
      recommendedAge: '12 months',
      actionText: 'Schedule Now',
    },
    readAt: getDate(25, 6),
    createdAt: getDate(25, 10),
    updatedAt: getDate(25, 6),
  },

  // Unread - Urgent System Alert
  {
    id: '18',
    userId: 'user123',
    type: NotificationTypeEnum.SECURITY_ALERT,
    title: 'Security Alert',
    message: 'New login detected from iPhone 14 Pro. Was this you?',
    status: NotificationStatusEnum.SENT,
    priority: NotificationPriorityEnum.URGENT,
    channels: [NotificationChannelEnum.PUSH, NotificationChannelEnum.EMAIL],
    data: {
      device: 'iPhone 14 Pro',
      location: 'Brooklyn, NY',
      time: '2 hours ago',
      actionText: 'Review Activity',
    },
    createdAt: getDate(0, 2),
    updatedAt: getDate(0, 2),
  },

  // Unread - Recommendation
  {
    id: '19',
    userId: 'user123',
    type: NotificationTypeEnum.RECOMMENDATION,
    title: 'Recommended for You',
    message: "Based on Emma's age, here are some developmental activities to try.",
    status: NotificationStatusEnum.SENT,
    priority: NotificationPriorityEnum.LOW,
    channels: [NotificationChannelEnum.IN_APP],
    data: {
      category: 'Developmental Activities',
      ageGroup: '10-12 months',
      activitiesCount: 5,
      actionText: 'Explore Activities',
    },
    createdAt: getDate(0, 4),
    updatedAt: getDate(0, 4),
  },

  // Unread - Celebration
  {
    id: '20',
    userId: 'user123',
    type: NotificationTypeEnum.CELEBRATION,
    title: 'Congratulations! 🎊',
    message: "Emma is 11 months old today! Time flies when they're growing.",
    status: NotificationStatusEnum.SENT,
    priority: NotificationPriorityEnum.NORMAL,
    channels: [NotificationChannelEnum.PUSH],
    data: {
      babyName: 'Emma',
      age: '11 months',
      milestoneType: 'Monthly',
      actionText: 'Share Update',
    },
    createdAt: getDate(0, 6),
    updatedAt: getDate(0, 6),
  },
];

// Mock Statistics
export const mockStatistics: NotificationStatistics = {
  total: mockNotifications.length,
  unread: mockNotifications.filter((n) => n.status !== NotificationStatusEnum.READ).length,
  byType: {
    [NotificationTypeEnum.APPOINTMENT_REMINDER]: 1,
    [NotificationTypeEnum.DOCTOR_APPOINTMENT]: 1,
    [NotificationTypeEnum.VACCINATION_REMINDER]: 1,
    [NotificationTypeEnum.VACCINATION_DUE]: 0,
    [NotificationTypeEnum.VACCINATION_RECORDED]: 1,
    [NotificationTypeEnum.MEDICATION_REMINDER]: 1,
    [NotificationTypeEnum.PRESCRIPTION_REMINDER]: 1,
    [NotificationTypeEnum.MEDICAL_VISIT_RECORDED]: 1,
    [NotificationTypeEnum.MILESTONE_ACHIEVED]: 1,
    [NotificationTypeEnum.GROWTH_UPDATE]: 1,
    [NotificationTypeEnum.GROWTH_RECORDED]: 1,
    [NotificationTypeEnum.BIRTHDAY_REMINDER]: 1,
    [NotificationTypeEnum.KINDNESS_CLOSET_CREATED]: 1,
    [NotificationTypeEnum.APPLICATION_RECEIVED]: 0,
    [NotificationTypeEnum.APPLICATION_APPROVED]: 1,
    [NotificationTypeEnum.APPLICATION_REJECTED]: 0,
    [NotificationTypeEnum.APPLICATION_NOT_SELECTED]: 0,
    [NotificationTypeEnum.APPLICATION_CANCELLED]: 0,
    [NotificationTypeEnum.APPLICATION_UPDATED]: 0,
    [NotificationTypeEnum.FAMILY_MEMBER_ADDED]: 1,
    [NotificationTypeEnum.FAMILY_MEMBER_REMOVED]: 0,
    [NotificationTypeEnum.FAMILY_MEMBER_UPDATED]: 0,
    [NotificationTypeEnum.FAMILY_INVITATION_SENT]: 0,
    [NotificationTypeEnum.FAMILY_INVITATION_ACCEPTED]: 0,
    [NotificationTypeEnum.FAMILY_INVITATION_DECLINED]: 0,
    [NotificationTypeEnum.HEALTH_RECORD_UPDATED]: 1,
    [NotificationTypeEnum.HEALTH_RECORD_CREATED]: 0,
    [NotificationTypeEnum.FOLLOW_UP_REMINDER]: 1,
    [NotificationTypeEnum.GENERAL_REMINDER]: 1,
    [NotificationTypeEnum.RECOMMENDATION]: 1,
    [NotificationTypeEnum.CELEBRATION]: 1,
    [NotificationTypeEnum.COMMUNITY_ACHIEVEMENT]: 1,
    [NotificationTypeEnum.SECURITY_ALERT]: 1,
    [NotificationTypeEnum.BABY_CREATED]: 0,
    [NotificationTypeEnum.BABY_UPDATED]: 0,
    [NotificationTypeEnum.BABY_DELETED]: 0,
    [NotificationTypeEnum.BABY_AVATAR_UPDATED]: 0,
    [NotificationTypeEnum.SHARING_COMPLETED]: 0,
    [NotificationTypeEnum.PICKUP_READY]: 0,
    [NotificationTypeEnum.POST_DELETED]: 0,
    [NotificationTypeEnum.POST_EXPIRED]: 0,
    [NotificationTypeEnum.POST_SHARED]: 0,
    [NotificationTypeEnum.POST_FAVORITED]: 0,
    [NotificationTypeEnum.POST_REPORTED]: 0,
    [NotificationTypeEnum.NEARBY_POST_AVAILABLE]: 0,
    [NotificationTypeEnum.SIMILAR_ITEM_AVAILABLE]: 0,
    [NotificationTypeEnum.KINDNESS_MILESTONE]: 0,
    [NotificationTypeEnum.MEDICAL_INFO_UPDATED]: 0,
    [NotificationTypeEnum.PREGNANCY_JOURNAL]: 0,
    [NotificationTypeEnum.SYSTEM_MAINTENANCE]: 0,
    [NotificationTypeEnum.ACCOUNT_UPDATE]: 0,
    [NotificationTypeEnum.CUSTOM]: 0,
    [NotificationTypeEnum.URGENT]: 0,
  },
  byPriority: {
    [NotificationPriorityEnum.LOW]: 4,
    [NotificationPriorityEnum.NORMAL]: 10,
    [NotificationPriorityEnum.HIGH]: 4,
    [NotificationPriorityEnum.URGENT]: 2,
  },
  byChannel: {
    [NotificationChannelEnum.IN_APP]: 12,
    [NotificationChannelEnum.PUSH]: 14,
    [NotificationChannelEnum.EMAIL]: 6,
    [NotificationChannelEnum.SMS]: 1,
    [NotificationChannelEnum.WEBHOOK]: 0,
  },
  todayCount: 6,
  weekCount: 11,
  monthCount: 20,
};

// Mock User Preferences
export const mockPreferences: NotificationPreferences = {
  pushEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  inAppEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,

  typePreferences: {
    [NotificationTypeEnum.APPOINTMENT_REMINDER]: {
      enabled: true,
      channels: [NotificationChannelEnum.PUSH, NotificationChannelEnum.EMAIL],
      priority: NotificationPriorityEnum.HIGH,
    },
    [NotificationTypeEnum.VACCINATION_REMINDER]: {
      enabled: true,
      channels: [NotificationChannelEnum.PUSH, NotificationChannelEnum.EMAIL],
      priority: NotificationPriorityEnum.HIGH,
    },
    [NotificationTypeEnum.MEDICATION_REMINDER]: {
      enabled: true,
      channels: [NotificationChannelEnum.PUSH],
      priority: NotificationPriorityEnum.HIGH,
    },
    [NotificationTypeEnum.MILESTONE_ACHIEVED]: {
      enabled: true,
      channels: [NotificationChannelEnum.PUSH, NotificationChannelEnum.IN_APP],
      priority: NotificationPriorityEnum.NORMAL,
    },
    [NotificationTypeEnum.KINDNESS_CLOSET_CREATED]: {
      enabled: true,
      channels: [NotificationChannelEnum.IN_APP],
      priority: NotificationPriorityEnum.LOW,
    },
    [NotificationTypeEnum.COMMUNITY_ACHIEVEMENT]: {
      enabled: true,
      channels: [NotificationChannelEnum.IN_APP],
      priority: NotificationPriorityEnum.LOW,
    },
  } as any,

  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',

  groupNotifications: true,
  showPreview: true,
  autoMarkAsRead: false,
  autoDeleteAfterDays: 30,
};

// Helper function to get filtered notifications
export const getFilteredNotifications = (filter: 'all' | 'unread' | 'today' | 'high_priority'): Notification[] => {
  switch (filter) {
    case 'unread':
      return mockNotifications.filter((n) => n.status !== NotificationStatusEnum.READ);
    case 'today':
      const today = new Date();
      return mockNotifications.filter((n) => {
        const notificationDate = new Date(n.createdAt);
        return notificationDate.toDateString() === today.toDateString();
      });
    case 'high_priority':
      return mockNotifications.filter(
        (n) => n.priority === NotificationPriorityEnum.HIGH || n.priority === NotificationPriorityEnum.URGENT,
      );
    default:
      return mockNotifications;
  }
};

// Helper function to generate more notifications for stress testing
export const generateBulkNotifications = (count: number): Notification[] => {
  const notifications: Notification[] = [];
  const types = Object.values(NotificationTypeEnum);
  const priorities = Object.values(NotificationPriorityEnum);
  const statuses = [NotificationStatusEnum.SENT, NotificationStatusEnum.READ];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const isRead = Math.random() > 0.3;

    notifications.push({
      id: `bulk-${i + 1}`,
      userId: 'user123',
      type: types[Math.floor(Math.random() * types.length)],
      title: `Notification Title ${i + 1}`,
      message: `This is notification message number ${i + 1}. It contains important information for testing purposes.`,
      status: isRead ? NotificationStatusEnum.READ : NotificationStatusEnum.SENT,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      channels: [NotificationChannelEnum.IN_APP],
      data: {
        index: i,
        testData: true,
        actionText: 'View Details',
      },
      readAt: isRead ? getDate(daysAgo, hoursAgo - 1) : undefined,
      createdAt: getDate(daysAgo, hoursAgo),
      updatedAt: getDate(daysAgo, hoursAgo - (isRead ? 1 : 0)),
    });
  }

  return notifications;
};

// Export functions for testing
export const mockNotificationService = {
  getNotifications: async (page: number = 1, limit: number = 20) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = mockNotifications.slice(start, end);

    return {
      data: paginatedData,
      total: mockNotifications.length,
      page,
      limit,
      hasNextPage: end < mockNotifications.length,
      unreadCount: mockNotifications.filter((n) => n.status !== NotificationStatusEnum.READ).length,
    };
  },

  markAsRead: async (id: string) => {
    const notification = mockNotifications.find((n) => n.id === id);
    if (notification) {
      notification.status = NotificationStatusEnum.READ;
      notification.readAt = new Date().toISOString();
    }
    return notification;
  },

  markAllAsRead: async () => {
    mockNotifications.forEach((n) => {
      if (n.status !== NotificationStatusEnum.READ) {
        n.status = NotificationStatusEnum.READ;
        n.readAt = new Date().toISOString();
      }
    });
    return { success: true, markedCount: mockNotifications.length };
  },

  deleteNotification: async (id: string) => {
    const index = mockNotifications.findIndex((n) => n.id === id);
    if (index > -1) {
      mockNotifications.splice(index, 1);
    }
    return { success: true };
  },

  getStatistics: async () => mockStatistics,

  getPreferences: async () => mockPreferences,
};

// src/models/BabyBadgesCollection/BabyBadgesCollectionEnum.ts

// Verification status for badge collections
export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  AUTO_APPROVED = 'auto_approved',
}

// Display labels
export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: 'Pending Review',
  [VerificationStatus.APPROVED]: 'Approved',
  [VerificationStatus.REJECTED]: 'Rejected',
  [VerificationStatus.AUTO_APPROVED]: 'Auto-Approved',
};

export const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: '#F59E0B', // Amber
  [VerificationStatus.APPROVED]: '#10B981', // Green
  [VerificationStatus.REJECTED]: '#EF4444', // Red
  [VerificationStatus.AUTO_APPROVED]: '#3B82F6', // Blue
};

export const VERIFICATION_STATUS_ICONS: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: 'clock',
  [VerificationStatus.APPROVED]: 'check-circle',
  [VerificationStatus.REJECTED]: 'x-circle',
  [VerificationStatus.AUTO_APPROVED]: 'shield-check',
};

// Helper function
export const getVerificationStatusInfo = (status: VerificationStatus) => ({
  label: VERIFICATION_STATUS_LABELS[status],
  color: VERIFICATION_STATUS_COLORS[status],
  icon: VERIFICATION_STATUS_ICONS[status],
});

// src/models/Baby/BabyEnum.ts

export enum FamilyRelationTypeEnum {
  MOTHER = 'mother',
  FATHER = 'father',
  GRANDMOTHER_MATERNAL = 'grandmother_maternal', // Bà ngoại
  GRANDFATHER_MATERNAL = 'grandfather_maternal', // Ông ngoại
  GRANDMOTHER_PATERNAL = 'grandmother_paternal', // Bà nội
  GRANDFATHER_PATERNAL = 'grandfather_paternal', // Ông nội
  AUNT_MATERNAL = 'aunt_maternal', // Cô/Dì (maternal side)
  UNCLE_MATERNAL = 'uncle_maternal', // Cậu/Chú (maternal side)
  AUNT_PATERNAL = 'aunt_paternal', // Cô/Dì (paternal side)
  UNCLE_PATERNAL = 'uncle_paternal', // Chú/Bác (paternal side)
  STEPMOTHER = 'stepmother',
  STEPFATHER = 'stepfather',
  GUARDIAN = 'guardian', // Người giám hộ
  NANNY = 'nanny', // Người trông trẻ
  OTHER = 'other', // Khác
}

export enum BabyPermissionEnum {
  VIEW = 'view', // Xem thông tin cơ bản
  VIEW_MEDICAL = 'view_medical', // Xem thông tin y tế (allergies, medications)
  EDIT = 'edit', // Chỉnh sửa thông tin
  EDIT_MEDICAL = 'edit_medical', // Chỉnh sửa thông tin y tế
  DELETE = 'delete', // Xóa baby
  MANAGE_FAMILY = 'manage_family', // Thêm/xóa family members
  UPLOAD_MEDIA = 'upload_media', // Upload ảnh/video
  VIEW_ANALYTICS = 'view_analytics', // Xem thống kê, growth charts
}

export enum BabyGender {
  MALE = 'male',
  FEMALE = 'female',
}

// UI-specific enums
export enum BabyScreenTab {
  PROFILE = 'profile',
  INFO = 'info',
  FAMILY = 'family',
  HEALTH = 'health',
}

export enum BabyActionType {
  VIEW_PROFILE = 'view_profile',
  EDIT_INFO = 'edit_info',
  MANAGE_FAMILY = 'manage_family',
  INVITE_MEMBER = 'invite_member',
  UPLOAD_AVATAR = 'upload_avatar',
  DELETE_BABY = 'delete_baby',
}

// Permission sets by relation type (matching backend)
export const PERMISSION_SETS: Record<FamilyRelationTypeEnum, BabyPermissionEnum[]> = {
  [FamilyRelationTypeEnum.MOTHER]: [
    BabyPermissionEnum.VIEW,
    BabyPermissionEnum.VIEW_MEDICAL,
    BabyPermissionEnum.EDIT,
    BabyPermissionEnum.EDIT_MEDICAL,
    BabyPermissionEnum.DELETE,
    BabyPermissionEnum.MANAGE_FAMILY,
    BabyPermissionEnum.UPLOAD_MEDIA,
    BabyPermissionEnum.VIEW_ANALYTICS,
  ],
  [FamilyRelationTypeEnum.FATHER]: [
    BabyPermissionEnum.VIEW,
    BabyPermissionEnum.VIEW_MEDICAL,
    BabyPermissionEnum.EDIT,
    BabyPermissionEnum.EDIT_MEDICAL,
    BabyPermissionEnum.DELETE,
    BabyPermissionEnum.MANAGE_FAMILY,
    BabyPermissionEnum.UPLOAD_MEDIA,
    BabyPermissionEnum.VIEW_ANALYTICS,
  ],
  [FamilyRelationTypeEnum.GRANDMOTHER_MATERNAL]: [
    BabyPermissionEnum.VIEW,
    BabyPermissionEnum.VIEW_MEDICAL,
    BabyPermissionEnum.EDIT,
    BabyPermissionEnum.UPLOAD_MEDIA,
    BabyPermissionEnum.VIEW_ANALYTICS,
  ],
  [FamilyRelationTypeEnum.GRANDFATHER_MATERNAL]: [
    BabyPermissionEnum.VIEW,
    BabyPermissionEnum.VIEW_MEDICAL,
    BabyPermissionEnum.EDIT,
    BabyPermissionEnum.UPLOAD_MEDIA,
    BabyPermissionEnum.VIEW_ANALYTICS,
  ],
  [FamilyRelationTypeEnum.GRANDMOTHER_PATERNAL]: [
    BabyPermissionEnum.VIEW,
    BabyPermissionEnum.VIEW_MEDICAL,
    BabyPermissionEnum.EDIT,
    BabyPermissionEnum.UPLOAD_MEDIA,
    BabyPermissionEnum.VIEW_ANALYTICS,
  ],
  [FamilyRelationTypeEnum.GRANDFATHER_PATERNAL]: [
    BabyPermissionEnum.VIEW,
    BabyPermissionEnum.VIEW_MEDICAL,
    BabyPermissionEnum.EDIT,
    BabyPermissionEnum.UPLOAD_MEDIA,
    BabyPermissionEnum.VIEW_ANALYTICS,
  ],
  [FamilyRelationTypeEnum.NANNY]: [
    BabyPermissionEnum.VIEW,
    BabyPermissionEnum.VIEW_MEDICAL,
    BabyPermissionEnum.UPLOAD_MEDIA,
  ],
  [FamilyRelationTypeEnum.GUARDIAN]: [
    BabyPermissionEnum.VIEW,
    BabyPermissionEnum.VIEW_MEDICAL,
    BabyPermissionEnum.EDIT,
    BabyPermissionEnum.EDIT_MEDICAL,
    BabyPermissionEnum.MANAGE_FAMILY,
    BabyPermissionEnum.UPLOAD_MEDIA,
    BabyPermissionEnum.VIEW_ANALYTICS,
  ],
  [FamilyRelationTypeEnum.OTHER]: [BabyPermissionEnum.VIEW],
  [FamilyRelationTypeEnum.AUNT_MATERNAL]: [BabyPermissionEnum.VIEW, BabyPermissionEnum.UPLOAD_MEDIA],
  [FamilyRelationTypeEnum.UNCLE_MATERNAL]: [BabyPermissionEnum.VIEW, BabyPermissionEnum.UPLOAD_MEDIA],
  [FamilyRelationTypeEnum.AUNT_PATERNAL]: [BabyPermissionEnum.VIEW, BabyPermissionEnum.UPLOAD_MEDIA],
  [FamilyRelationTypeEnum.UNCLE_PATERNAL]: [BabyPermissionEnum.VIEW, BabyPermissionEnum.UPLOAD_MEDIA],
  [FamilyRelationTypeEnum.STEPMOTHER]: [
    BabyPermissionEnum.VIEW,
    BabyPermissionEnum.VIEW_MEDICAL,
    BabyPermissionEnum.EDIT,
    BabyPermissionEnum.UPLOAD_MEDIA,
  ],
  [FamilyRelationTypeEnum.STEPFATHER]: [
    BabyPermissionEnum.VIEW,
    BabyPermissionEnum.VIEW_MEDICAL,
    BabyPermissionEnum.EDIT,
    BabyPermissionEnum.UPLOAD_MEDIA,
  ],
};

// Display names for relations (localized)
export const RELATION_DISPLAY_NAMES: Record<FamilyRelationTypeEnum, string> = {
  [FamilyRelationTypeEnum.MOTHER]: 'Mother',
  [FamilyRelationTypeEnum.FATHER]: 'Father',
  [FamilyRelationTypeEnum.GRANDMOTHER_MATERNAL]: 'Maternal Grandmother',
  [FamilyRelationTypeEnum.GRANDFATHER_MATERNAL]: 'Maternal Grandfather',
  [FamilyRelationTypeEnum.GRANDMOTHER_PATERNAL]: 'Paternal Grandmother',
  [FamilyRelationTypeEnum.GRANDFATHER_PATERNAL]: 'Paternal Grandfather',
  [FamilyRelationTypeEnum.AUNT_MATERNAL]: 'Maternal Aunt',
  [FamilyRelationTypeEnum.UNCLE_MATERNAL]: 'Maternal Uncle',
  [FamilyRelationTypeEnum.AUNT_PATERNAL]: 'Paternal Aunt',
  [FamilyRelationTypeEnum.UNCLE_PATERNAL]: 'Paternal Uncle',
  [FamilyRelationTypeEnum.STEPMOTHER]: 'Stepmother',
  [FamilyRelationTypeEnum.STEPFATHER]: 'Stepfather',
  [FamilyRelationTypeEnum.GUARDIAN]: 'Guardian',
  [FamilyRelationTypeEnum.NANNY]: 'Nanny',
  [FamilyRelationTypeEnum.OTHER]: 'Other',
};

// Permission display names
export const PERMISSION_DISPLAY_NAMES: Record<BabyPermissionEnum, string> = {
  [BabyPermissionEnum.VIEW]: 'View Basic Info',
  [BabyPermissionEnum.VIEW_MEDICAL]: 'View Medical Info',
  [BabyPermissionEnum.EDIT]: 'Edit Basic Info',
  [BabyPermissionEnum.EDIT_MEDICAL]: 'Edit Medical Info',
  [BabyPermissionEnum.DELETE]: 'Delete Baby',
  [BabyPermissionEnum.MANAGE_FAMILY]: 'Manage Family',
  [BabyPermissionEnum.UPLOAD_MEDIA]: 'Upload Media',
  [BabyPermissionEnum.VIEW_ANALYTICS]: 'View Analytics',
};

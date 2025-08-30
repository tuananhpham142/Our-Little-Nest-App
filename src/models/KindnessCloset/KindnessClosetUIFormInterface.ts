// src/models/KindnessCloset/KindnessClosetUIFormInterface.ts

import { AgeUnit, Gender, KindnessClosetStatus, KindnessClosetType } from './KindnessClosetEnum';

// Form field validation rules
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

// Form field interface
export interface FormField<T = any> {
  value: T;
  error?: string;
  touched?: boolean;
  validation?: ValidationRule;
}

// Main post form
export interface KindnessClosetFormData {
  type: FormField<KindnessClosetType | ''>;
  title: FormField<string>;
  description: FormField<string>;
  babyInfo: {
    name: FormField<string>;
    ageFrom: FormField<number | ''>;
    ageTo: FormField<number | ''>;
    ageUnit: FormField<AgeUnit | ''>;
    gender: FormField<Gender | ''>;
    weight: FormField<number | ''>;
    height: FormField<number | ''>;
  };
  location: FormField<string>;
  tags: FormField<string[]>;
  images: FormField<File[]>;
  videos: FormField<File[]>;
  conditions: FormField<string>;
  expiresAt: FormField<Date | null>;
}

// Application form
export interface ApplicationFormData {
  message: FormField<string>;
  contactInfo: {
    phoneNumber: FormField<string>;
    contactName: FormField<string>;
    address: FormField<string>;
  };
  babyInfo: {
    name: FormField<string>;
    ageFrom: FormField<number | ''>;
    ageTo: FormField<number | ''>;
    ageUnit: FormField<AgeUnit | ''>;
    gender: FormField<Gender | ''>;
    weight: FormField<number | ''>;
    height: FormField<number | ''>;
  };
  itemsInfo: Array<{
    itemName: FormField<string>;
    condition: FormField<string>;
    quantity: FormField<number | ''>;
    images: FormField<File[]>;
  }>;
}

// Filter form
export interface KindnessClosetFilterForm {
  type: FormField<KindnessClosetType | ''>;
  status: FormField<KindnessClosetStatus | ''>;
  city: FormField<string>;
  district: FormField<string>;
  tag: FormField<string>;
  search: FormField<string>;
  minAgeFrom: FormField<number | ''>;
  maxAgeTo: FormField<number | ''>;
  ageUnit: FormField<AgeUnit | ''>;
  gender: FormField<Gender | ''>;
  radius: FormField<number | ''>;
}

// Form validation helpers
export const ValidationRules = {
  title: {
    required: true,
    minLength: 5,
    maxLength: 200,
    message: 'Tiêu đề phải từ 5 đến 200 ký tự',
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 2000,
    message: 'Mô tả phải từ 10 đến 2000 ký tự',
  },
  phoneNumber: {
    required: true,
    pattern: /^(0|\+84)[0-9]{9,10}$/,
    message: 'Số điện thoại không hợp lệ',
  },
  contactName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Tên liên hệ phải từ 2 đến 100 ký tự',
  },
  ageFrom: {
    min: 0,
    max: 200,
    message: 'Tuổi phải từ 0 đến 200',
  },
  ageTo: {
    min: 0,
    max: 200,
    message: 'Tuổi phải từ 0 đến 200',
  },
  weight: {
    min: 0,
    max: 50,
    message: 'Cân nặng phải từ 0 đến 50kg',
  },
  height: {
    min: 0,
    max: 200,
    message: 'Chiều cao phải từ 0 đến 200cm',
  },
  images: {
    max: 10,
    message: 'Tối đa 10 hình ảnh',
  },
  videos: {
    max: 3,
    message: 'Tối đa 3 video',
  },
  tags: {
    required: true,
    min: 1,
    max: 10,
    message: 'Phải có từ 1 đến 10 thẻ',
  },
  itemName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Tên sản phẩm phải từ 2 đến 100 ký tự',
  },
  quantity: {
    min: 1,
    max: 999,
    message: 'Số lượng phải từ 1 đến 999',
  },
};

// Form initial values
export const getInitialKindnessClosetForm = (): KindnessClosetFormData => ({
  type: { value: '' },
  title: { value: '' },
  description: { value: '' },
  babyInfo: {
    name: { value: '' },
    ageFrom: { value: '' },
    ageTo: { value: '' },
    ageUnit: { value: '' },
    gender: { value: '' },
    weight: { value: '' },
    height: { value: '' },
  },
  location: { value: '' },
  tags: { value: [] },
  images: { value: [] },
  videos: { value: [] },
  conditions: { value: '' },
  expiresAt: { value: null },
});

export const getInitialApplicationForm = (): ApplicationFormData => ({
  message: { value: '' },
  contactInfo: {
    phoneNumber: { value: '' },
    contactName: { value: '' },
    address: { value: '' },
  },
  babyInfo: {
    name: { value: '' },
    ageFrom: { value: '' },
    ageTo: { value: '' },
    ageUnit: { value: '' },
    gender: { value: '' },
    weight: { value: '' },
    height: { value: '' },
  },
  itemsInfo: [],
});

export const getInitialFilterForm = (): KindnessClosetFilterForm => ({
  type: { value: '' },
  status: { value: '' },
  city: { value: '' },
  district: { value: '' },
  tag: { value: '' },
  search: { value: '' },
  minAgeFrom: { value: '' },
  maxAgeTo: { value: '' },
  ageUnit: { value: '' },
  gender: { value: '' },
  radius: { value: '' },
});

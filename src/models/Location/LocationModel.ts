// src/models/Location/LocationModel.ts

export interface Location {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  ward: string;
  district: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Helper to get full address
export const getFullAddress = (location: Location): string => {
  const parts = [];
  if (location.ward) parts.push(location.ward);
  if (location.district) parts.push(location.district);
  if (location.city) parts.push(location.city);
  if (location.country) parts.push(location.country);
  return parts.join(', ');
};

// Helper to get short address
export const getShortAddress = (location: Location): string => {
  return `${location.district}, ${location.city}`;
};

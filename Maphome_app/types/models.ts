export type UserRole = 'admin' | 'landlord' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName?: string;
  phone?: string;
  avatar?: string;
  verificationLevel?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  role: Exclude<UserRole, 'admin'>;
}

export interface Amenities {
  wifi?: boolean;
  furniture?: boolean;
  tv?: boolean;
  washingMachine?: boolean;
  kitchen?: boolean;
  refrigerator?: boolean;
  airConditioner?: boolean;
  parking?: boolean;
  water?: boolean;
  ac?: boolean;
}

export interface LandlordProfile {
  _id?: string;
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  rating?: number;
}

export interface RentalProperty {
  _id: string;
  name: string;
  address: string;
  price: number;
  area: number;
  location: [number, number];
  available: boolean;
  image?: string;
  images?: string[];
  amenities?: Amenities;
  phone?: string;
  ownerName?: string;
  landlordId?: LandlordProfile | string;
  description?: string;
  views?: number;
  favorites?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'reported' | 'expired';
  nearbyLandmarks?: Array<{
    name: string;
    distanceKm: number;
    distanceText: string;
  }>;
}

export interface Booking {
  _id: string;
  propertyId?: RentalProperty;
  userId?: string;
  landlordId?: string;
  fullName?: string;
  phone?: string;
  note?: string;
  inspectionDate?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt?: string;
}

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description?: string;
  features?: string[];
}

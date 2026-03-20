// Green Badge System Types
export type GreenBadgeLevel = 'none' | 'verified';

export interface GreenBadge {
  level: GreenBadgeLevel;
  awardedAt: string; // ISO date string
  awardedBy: string; // Admin ID
  inspectionNotes?: string;
}

export interface VerificationRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  landlordId: string;
  landlordName: string;
  phone: string;
  address: string;
  scheduledDate: string; // ISO date string
  scheduledTime: string; // e.g., "14:00"
  notes?: string;
  status: 'pending' | 'approved' | 'awaiting_photos' | 'photos_submitted' | 'completed' | 'rejected';
  requestedAt: string; // Đổi từ createdAt để consistent
  completedAt?: string;
  badgeAwarded?: GreenBadgeLevel;
  inspectorNotes?: string;
  // New fields for user requests
  requesterType: 'landlord' | 'user'; // Ai yêu cầu kiểm tra
  requesterId: string; // ID của người yêu cầu (landlordId hoặc userId)
  requesterName: string; // Tên người yêu cầu
  requesterPhone?: string; // SĐT người yêu cầu (nếu là user)
  userProvidedPhotos?: string[]; // Ảnh user gửi kèm
  notifiedAt?: string; // Thời điểm thông báo user gửi ảnh
  photosSubmittedAt?: string; // Thời điểm user gửi ảnh
}

export interface LandlordProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  totalListings: number;
  rating: number;
  responseRate: number; // percent
  responseTime: string; // e.g. "< 1 giờ"
  joinedDate: string; // ISO date
  verified: boolean;
}

export interface PinInfo {
  pinnedAt: string; // ISO date
  pinnedBy: string; // landlord id
  note?: string; // ghi chú của chủ trọ khi ghim
  photoAtPin?: string; // ảnh chụp tại vị trí ghim
}

export interface RentalProperty {
  id: string;
  name: string;
  address: string;
  price: number;
  location: [number, number]; // [latitude, longitude]
  amenities: {
    wifi: boolean;
    furniture: boolean;
    tv: boolean;
    washingMachine: boolean;
    kitchen: boolean;
    refrigerator: boolean;
    airConditioner: boolean;
  };
  image: string;
  area: number; // in m²
  available: boolean;
  phone: string;
  ownerName: string;
  verificationLevel: VerificationLevel;
  verifiedAt?: string; // ISO date string
  locationAccuracy?: number; // meters
  // Landlord pinning fields
  landlordId?: string;
  pinInfo?: PinInfo;
  // Green badge (tích xanh)
  greenBadge?: GreenBadge;
  views?: number;
  favorites?: number;
}
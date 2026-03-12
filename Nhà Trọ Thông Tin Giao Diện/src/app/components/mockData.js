import { RentalProperty, LandlordProfile } from "./types";

// ===== MOCK LANDLORD PROFILES =====
export const mockLandlords = [
  {
    id: "landlord-001",
    name: "Nguyễn Văn A",
    phone: "0912 345 678",
    email: "nguyenvana@gmail.com",
    totalListings: 5,
    rating: 4.8,
    responseRate: 98,
    responseTime: "< 30 phút",
    joinedDate: "2024-03-15T00:00:00Z",
    verified: true,
  },
  {
    id: "landlord-002",
    name: "Trần Thị B",
    phone: "0987 654 321",
    email: "tranthib@gmail.com",
    totalListings: 3,
    rating: 4.5,
    responseRate: 92,
    responseTime: "< 1 giờ",
    joinedDate: "2024-06-20T00:00:00Z",
    verified: true,
  },
  {
    id: "landlord-003",
    name: "Lê Minh C",
    phone: "0934 567 890",
    email: "leminhc@gmail.com",
    totalListings: 2,
    rating: 4.2,
    responseRate: 85,
    responseTime: "< 2 giờ",
    joinedDate: "2025-01-10T00:00:00Z",
    verified: false,
  },
  {
    id: "landlord-004",
    name: "Phạm Hồng D",
    phone: "0909 876 543",
    email: "phamhongd@gmail.com",
    totalListings: 8,
    rating: 4.9,
    responseRate: 99,
    responseTime: "< 15 phút",
    joinedDate: "2023-11-05T00:00:00Z",
    verified: true,
  },
  {
    id: "landlord-005",
    name: "Hoàng Thị E",
    phone: "0978 234 567",
    email: "hoangthie@gmail.com",
    totalListings: 1,
    rating: 4.0,
    responseRate: 75,
    responseTime: "< 3 giờ",
    joinedDate: "2025-09-01T00:00:00Z",
    verified: false,
  },
];

// Default amenities object used for mock properties
export const defaultAmenities = {
  wifi: true,
  furniture: true,
  tv: true,
  washingMachine: false,
  kitchen: true,
  refrigerator: true,
  airConditioner: true,
};

// ===== MOCK RENTAL PROPERTIES =====
export const mockRentalProperties = [
  {
    id: "1",
    name: "Phòng trọ Nguyễn Trãi",
    address: "123 Nguyễn Trãi, Quận 5, TP.HCM",
    price: 3500000,
    location: [10.754, 106.6633],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc2ODQ5NjIzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    area: 25,
    available: true,
    phone: "0912 345 678",
    ownerName: "Nguyễn Văn A",
    verificationLevel: "location-verified",
    verifiedAt: "2026-01-20T10:30:00Z",
    locationAccuracy: 8,
    landlordId: "landlord-001",
    pinInfo: {
      pinnedAt: "2026-01-20T10:30:00Z",
      pinnedBy: "landlord-001",
      note: "Phòng mới sơn, sạch sẽ, gần chợ Nguyễn Trãi",
      photoAtPin:
        "https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc2ODQ5NjIzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  },
  {
    id: "2",
    name: "Nhà trọ Điện Biên Phủ",
    address: "456 Điện Biên Phủ, Bình Thạnh, TP.HCM",
    price: 2800000,
    location: [10.801, 106.711],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1627649495622-d54be2ffaa51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGlvJTIwcm9vbXxlbnwxfHx8fDE3Njg1MzM0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    area: 20,
    available: true,
    phone: "0987 654 321",
    ownerName: "Trần Thị B",
    verificationLevel: "phone-verified",
    verifiedAt: "2026-01-25T15:20:00Z",
    landlordId: "landlord-002",
    pinInfo: {
      pinnedAt: "2026-01-25T15:20:00Z",
      pinnedBy: "landlord-002",
      note: "Cách cầu Sài Gòn 200m, thuận tiện đi lại",
    },
  },
  {
    id: "3",
    name: "Trọ sinh viên Lý Thường Kiệt",
    address: "789 Lý Thường Kiệt, Quận 10, TP.HCM",
    price: 2200000,
    location: [10.7735, 106.658],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1673970303139-72fafe11bc93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGFwYXJ0bWVudCUyMGludGVyaW9yfGVufDF8fHx8MTc2ODQ2NDQxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    area: 18,
    available: true,
    phone: "0934 567 890",
    ownerName: "Lê Minh C",
    verificationLevel: "unverified",
    landlordId: "landlord-003",
  },
  {
    id: "4",
    name: "Phòng trọ Lê Văn Sỹ",
    address: "321 Lê Văn Sỹ, Quận 3, TP.HCM",
    price: 4200000,
    location: [10.788, 106.675],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1630233792725-5d6a2413e3c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW50YWwlMjByb29tJTIwYmVkcm9vbXxlbnwxfHx8fDE3Njg1MzM0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    area: 30,
    available: true,
    phone: "0909 876 543",
    ownerName: "Phạm Hồng D",
    verificationLevel: "location-verified",
    verifiedAt: "2026-01-22T14:15:00Z",
    locationAccuracy: 12,
    landlordId: "landlord-004",
    pinInfo: {
      pinnedAt: "2026-01-22T14:15:00Z",
      pinnedBy: "landlord-004",
      note: "Ngay góc Lê Văn Sỹ - Trần Quang Diệu, tầng 3",
      photoAtPin:
        "https://images.unsplash.com/photo-1630233792725-5d6a2413e3c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW50YWwlMjByb29tJTIwYmVkcm9vbXxlbnwxfHx8fDE3Njg1MzM0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  },
  {
    id: "5",
    name: "Nhà trọ Phan Xích Long",
    address: "555 Phan Xích Long, Phú Nhuận, TP.HCM",
    price: 2500000,
    location: [10.795, 106.683],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbXxlbnwxfHx8fDE3Njg1MjYxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    area: 15,
    available: false,
    phone: "0909 876 543",
    ownerName: "Phạm Hồng D",
    verificationLevel: "phone-verified",
    verifiedAt: "2026-01-26T09:45:00Z",
    landlordId: "landlord-004",
    pinInfo: {
      pinnedAt: "2026-01-26T09:45:00Z",
      pinnedBy: "landlord-004",
      note: "Gần chợ Phú Nhuận, tiện mua sắm",
    },
  },
  {
    id: "6",
    name: "Trọ cao cấp Thảo Điền",
    address: "888 Xuân Thủy, Thảo Điền, Quận 2, TP.HCM",
    price: 5000000,
    location: [10.803, 106.735],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1718066236079-9085195c389e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXNoZWQlMjBhcGFydG1lbnQlMjByb29tfGVufDF8fHx8MTc2ODUzMzQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    area: 35,
    available: true,
    phone: "0978 234 567",
    ownerName: "Hoàng Thị E",
    verificationLevel: "location-verified",
    verifiedAt: "2026-01-18T11:20:00Z",
    locationAccuracy: 5,
    landlordId: "landlord-005",
    pinInfo: {
      pinnedAt: "2026-01-18T11:20:00Z",
      pinnedBy: "landlord-005",
      note: "Khu An Phú, yên tĩnh, nhiều người nước ngoài",
      photoAtPin:
        "https://images.unsplash.com/photo-1718066236079-9085195c389e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXNoZWQlMjBhcGFydG1lbnQlMjByb29tfGVufDF8fHx8MTc2ODUzMzQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  },
  {
    id: "7",
    name: "Phòng trọ Nguyễn Đình Chiểu",
    address: "234 Nguyễn Đình Chiểu, Quận 3, TP.HCM",
    price: 3000000,
    location: [10.783, 106.69],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1675194814515-89227a3c91c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwbGl2aW5nJTIwc3BhY2V8ZW58MXx8fHwxNzY4NTMzNDUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    area: 22,
    available: true,
    phone: "0923 456 789",
    ownerName: "Lê Minh C",
    verificationLevel: "unverified",
    landlordId: "landlord-003",
  },
  {
    id: "8",
    name: "Nhà trọ Võ Văn Tần",
    address: "678 Võ Văn Tần, Quận 3, TP.HCM",
    price: 2600000,
    location: [10.7785, 106.688],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbXxlbnwxfHx8fDE3Njg0MTEyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    area: 16,
    available: true,
    phone: "0956 789 012",
    ownerName: "Nguyễn Văn A",
    verificationLevel: "phone-verified",
    verifiedAt: "2026-01-27T16:30:00Z",
    landlordId: "landlord-001",
    pinInfo: {
      pinnedAt: "2026-01-27T16:30:00Z",
      pinnedBy: "landlord-001",
      note: "Hẻm xe hơi, có chỗ để xe máy",
    },
  },
  {
    id: "9",
    name: "Trọ Cách Mạng Tháng 8",
    address: "999 CMT8, Quận 10, TP.HCM",
    price: 3800000,
    location: [10.77, 106.669],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1610513492097-13a9a4c343c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY4NDY2OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    area: 28,
    available: true,
    phone: "0901 234 567",
    ownerName: "Trần Thị B",
    verificationLevel: "location-verified",
    verifiedAt: "2026-01-19T13:50:00Z",
    locationAccuracy: 10,
    landlordId: "landlord-002",
    pinInfo: {
      pinnedAt: "2026-01-19T13:50:00Z",
      pinnedBy: "landlord-002",
      note: "Đối diện công viên Lê Thị Riêng, view đẹp tầng 5",
      photoAtPin:
        "https://images.unsplash.com/photo-1610513492097-13a9a4c343c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY4NDY2OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  },
  {
    id: "10",
    name: "Phòng trọ Hoàng Sa",
    address: "147 Hoàng Sa, Quận 1, TP.HCM",
    price: 3200000,
    location: [10.79, 106.697],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1704428382583-c9c7c1e55d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc2ODUzMzQ1NHww&ixlib=rb-4.1.0&q=80&w=1080",
    area: 24,
    available: true,
    phone: "0918 345 678",
    ownerName: "Phạm Hồng D",
    verificationLevel: "location-verified",
    verifiedAt: "2026-02-01T08:00:00Z",
    locationAccuracy: 6,
    landlordId: "landlord-004",
    pinInfo: {
      pinnedAt: "2026-02-01T08:00:00Z",
      pinnedBy: "landlord-004",
      note: "Gần Nhà thờ Tân Định, khu an ninh tốt",
      photoAtPin:
        "https://images.unsplash.com/photo-1704428382583-c9c7c1e55d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc2ODUzMzQ1NHww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  },
  // === NEW: Properties posted but NOT pinned by landlord ===
  {
    id: "11",
    name: "Phòng trọ Bùi Viện",
    address: "88 Bùi Viện, Quận 1, TP.HCM",
    price: 4500000,
    location: [10.768, 106.694],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbXxlbnwxfHx8fDE3Njg0MTEyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    area: 20,
    available: true,
    phone: "0966 111 222",
    ownerName: "Đỗ Văn F",
    verificationLevel: "unverified",
  },
  {
    id: "12",
    name: "Nhà trọ Nguyễn Thị Minh Khai",
    address: "200 NTMK, Quận 3, TP.HCM",
    price: 3600000,
    location: [10.782, 106.695],
    amenities: { ...defaultAmenities },
    image:
      "https://images.unsplash.com/photo-1673970303139-72fafe11bc93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGFwYXJ0bWVudCUyMGludGVyaW9yfGVufDF8fHx8MTc2ODQ2NDQxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    area: 22,
    available: false,
    phone: "0977 333 444",
    ownerName: "Võ Thanh G",
    verificationLevel: "phone-verified",
    verifiedAt: "2026-02-10T10:00:00Z",
  },
];

// Helper: get landlord by ID
export function getLandlordById(id) {
  return mockLandlords.find((l) => l.id === id);
}

// Helper: get properties by landlord
export function getPropertiesByLandlord(landlordId) {
  return mockRentalProperties.filter((p) => p.landlordId === landlordId);
}

// Helper: get pinned properties only
export function getPinnedProperties() {
  return mockRentalProperties.filter((p) => p.pinInfo);
}

export default mockRentalProperties;

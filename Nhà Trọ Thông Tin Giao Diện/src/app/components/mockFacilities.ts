export type FacilityType =
  | "hospital"
  | "school"
  | "supermarket"
  | "park"
  | "bus_stop";

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  lat: number;
  lng: number;
  address: string;
  description?: string;
}

// Mock facilities removed — export empty array for compatibility
export const mockFacilities: Facility[] = [];

import { RentalProperty } from '@/app/components/types';
import { Facility, mockFacilities } from '@/app/components/mockFacilities';
import { calculateDistance } from '@/app/utils/distanceCalculator';

export interface NearbyFacilitiesByType {
  hospital: Facility | null;
  school: Facility | null;
  supermarket: Facility | null;
  park: Facility | null;
  bus_stop: Facility | null;
}

export interface FacilityDistance {
  facility: Facility;
  distance: number; // km
}

export interface PropertyWithNearbyFacilities {
  property: RentalProperty;
  nearbyFacilities: NearbyFacilitiesByType;
  distances: {
    hospital: number | null;
    school: number | null;
    supermarket: number | null;
    park: number | null;
    bus_stop: number | null;
  };
}

/**
 * Tìm tiện ích gần nhất theo loại
 */
function findNearestFacility(
  propertyLocation: [number, number],
  facilityType: string
): FacilityDistance | null {
  const facilities = mockFacilities.filter(f => f.type === facilityType);
  
  if (facilities.length === 0) return null;

  const distancesWithFacilities = facilities.map(facility => ({
    facility,
    distance: calculateDistance(
      propertyLocation[0],
      propertyLocation[1],
      facility.lat,
      facility.lng
    ),
  }));

  // Sắp xếp theo khoảng cách tăng dần
  distancesWithFacilities.sort((a, b) => a.distance - b.distance);

  return distancesWithFacilities[0];
}

/**
 * Lấy thông tin tiện ích gần nhất cho 1 phòng
 */
export function getNearbyFacilities(property: RentalProperty): PropertyWithNearbyFacilities {
  const hospital = findNearestFacility(property.location, 'hospital');
  const school = findNearestFacility(property.location, 'school');
  const supermarket = findNearestFacility(property.location, 'supermarket');
  const park = findNearestFacility(property.location, 'park');
  const busStop = findNearestFacility(property.location, 'bus_stop');

  return {
    property,
    nearbyFacilities: {
      hospital: hospital?.facility || null,
      school: school?.facility || null,
      supermarket: supermarket?.facility || null,
      park: park?.facility || null,
      bus_stop: busStop?.facility || null,
    },
    distances: {
      hospital: hospital?.distance || null,
      school: school?.distance || null,
      supermarket: supermarket?.distance || null,
      park: park?.distance || null,
      bus_stop: busStop?.distance || null,
    },
  };
}

/**
 * Lấy thông tin tiện ích cho nhiều phòng (dùng cho so sánh)
 */
export function getNearbyFacilitiesForProperties(
  properties: RentalProperty[]
): PropertyWithNearbyFacilities[] {
  return properties.map(property => getNearbyFacilities(property));
}

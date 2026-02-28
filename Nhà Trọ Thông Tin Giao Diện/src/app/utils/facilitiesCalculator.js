import { mockFacilities } from "@/app/components/mockFacilities";
import { calculateDistance } from "@/app/utils/distanceCalculator";

/**
 * Tìm tiện ích gần nhất theo loại
 * @param {Array<number>} propertyLocation - [lat, lng]
 * @param {string} facilityType
 * @returns {{ facility: object, distance: number } | null}
 */
function findNearestFacility(propertyLocation, facilityType) {
  if (
    !propertyLocation ||
    !Array.isArray(propertyLocation) ||
    propertyLocation.length !== 2
  ) {
    return null;
  }

  const facilities = mockFacilities.filter((f) => f.type === facilityType);

  if (facilities.length === 0) return null;

  const distancesWithFacilities = facilities.map((facility) => ({
    facility,
    distance: calculateDistance(propertyLocation, facility.location),
  }));

  // Sắp xếp theo khoảng cách tăng dần
  distancesWithFacilities.sort((a, b) => a.distance - b.distance);

  return distancesWithFacilities[0];
}

/**
 * Lấy thông tin tiện ích gần nhất cho 1 phòng
 * @param {object} property
 */
export function getNearbyFacilities(property) {
  if (!property || !property.location) {
    return null;
  }

  const hospital = findNearestFacility(property.location, "hospital");
  const school = findNearestFacility(property.location, "school");
  const supermarket = findNearestFacility(property.location, "supermarket");
  const park = findNearestFacility(property.location, "park");
  const busStop = findNearestFacility(property.location, "bus_stop");

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
      hospital: hospital?.distance ?? null,
      school: school?.distance ?? null,
      supermarket: supermarket?.distance ?? null,
      park: park?.distance ?? null,
      bus_stop: busStop?.distance ?? null,
    },
  };
}

/**
 * Lấy thông tin tiện ích cho nhiều phòng (dùng cho so sánh)
 * @param {Array<object>} properties
 */
export function getNearbyFacilitiesForProperties(properties) {
  if (!Array.isArray(properties)) return [];

  return properties.map((property) => getNearbyFacilities(property));
}

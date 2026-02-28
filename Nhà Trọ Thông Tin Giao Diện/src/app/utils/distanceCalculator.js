/**
 * Calculate distance between two coordinate points [lat, lng]
 * using Haversine formula
 * @param {[number, number]} point1
 * @param {[number, number]} point2
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(point1, point2) {
  if (!point1 || !point2) return 0;

  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;

  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Format distance to readable string
 */
export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Add distance field to properties
 * @param {Array<Object>} properties
 * @param {[number, number]} referencePoint
 */
export function addDistanceToProperties(properties, referencePoint) {
  if (!Array.isArray(properties)) return [];

  return properties.map((property) => ({
    ...property,
    distance: calculateDistance(referencePoint, property.location),
  }));
}

/**
 * Filter properties within radius
 * @param {Array<Object>} properties
 * @param {[number, number]} centerPoint
 * @param {number} radiusKm
 */
export function filterByRadius(properties, centerPoint, radiusKm) {
  if (!Array.isArray(properties)) return [];

  return properties.filter((property) => {
    const distance = calculateDistance(centerPoint, property.location);
    return distance <= radiusKm;
  });
}

/**
 * Find centroid (approximate optimal location)
 * @param {Array<[number, number]>} points
 * @returns {[number, number]}
 */
export function findOptimalLocation(points) {
  if (!points || points.length === 0) return [0, 0];
  if (points.length === 1) return points[0];

  const avgLat = points.reduce((sum, p) => sum + p[0], 0) / points.length;

  const avgLon = points.reduce((sum, p) => sum + p[1], 0) / points.length;

  return [avgLat, avgLon];
}

/**
 * Calculate total distance to multiple destinations
 * @param {[number, number]} origin
 * @param {Array<[number, number]>} destinations
 */
export function calculateTotalDistance(origin, destinations) {
  if (!destinations || destinations.length === 0) return 0;

  return destinations.reduce((total, dest) => {
    return total + calculateDistance(origin, dest);
  }, 0);
}

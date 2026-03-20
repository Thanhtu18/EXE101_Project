import { RentalProperty, LandlordProfile } from './types';

export const mockLandlords: LandlordProfile[] = [];

export const mockRentalProperties: RentalProperty[] = [];

export function getLandlordById(id: string): LandlordProfile | undefined {
  return mockLandlords.find((l) => l.id === id);
}

export function getPropertiesByLandlord(landlordId: string): RentalProperty[] {
  return mockRentalProperties.filter((p) => p.landlordId === landlordId);
}

export function getPinnedProperties(): RentalProperty[] {
  return mockRentalProperties.filter((p) => !!p.pinInfo);
}

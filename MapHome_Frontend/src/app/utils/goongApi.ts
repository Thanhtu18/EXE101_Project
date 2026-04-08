/**
 * Goong Maps API Utility
 *
 * HOW TO USE:
 * 1. Get your keys from https://account.goong.io
 * 2. Add to your .env file:
 *    VITE_GOONG_API_KEY=your_api_key_here          (for Places / Geocoding)
 *    VITE_GOONG_MAPTILES_KEY=your_maptiles_key_here (for map tiles display)
 */

const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY || "";
const GOONG_MAPTILES_KEY = import.meta.env.VITE_GOONG_MAPTILES_KEY || "";

const GOONG_BASE_URL = "https://rsapi.goong.io";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GoongPrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface GoongGeocodeResult {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

// ─── Map Tile URL ─────────────────────────────────────────────────────────────

export type GoongMapStyle = 'light' | 'dark' | 'gray' | 'satellite';

export const GOONG_MAP_STYLES: Record<GoongMapStyle, { label: string; emoji: string; assetName: string }> = {
  light:     { label: 'Tiêu chuẩn',   emoji: '🗺️',  assetName: 'goong_map_web' },
  dark:      { label: 'Tối (Dark)',    emoji: '🌙',  assetName: 'goong_map_dark' },
  gray:      { label: 'Xám',          emoji: '⬜',  assetName: 'goong_map_gray' },
  satellite: { label: 'Vệ tinh',      emoji: '🛰️',  assetName: 'goong_map' },
};

/**
 * Returns the Goong raster tile URL for Leaflet TileLayer.
 * @param style - One of 'light' | 'dark' | 'gray' | 'satellite' (default: 'light')
 */
export const getGoongTileUrl = (style: GoongMapStyle = 'light'): string => {
  console.log("[GoongAPI] Style:", style, "Key:", GOONG_MAPTILES_KEY.substring(0, 5) + "...");
  if (!GOONG_MAPTILES_KEY) {
    console.warn("[GoongAPI] VITE_GOONG_MAPTILES_KEY is not set.");
    return ""; 
  }
  const { assetName } = GOONG_MAP_STYLES[style];
  const url = `https://tiles.goong.io/assets/${assetName}/{z}/{x}/{y}.png?api_key=${GOONG_MAPTILES_KEY}`;
  console.log("[GoongAPI] Tile URL generated:", url.replace(GOONG_MAPTILES_KEY, "HIDDEN"));
  return url;
};

export const getGoongAttribution = (): string => '&copy; <a href="https://goong.io">Goong Maps</a>';

// ─── Places Autocomplete ──────────────────────────────────────────────────────

/**
 * Autocomplete a place name/address using Goong Places API.
 * Returns a list of predictions (suggestions).
 *
 * @param input - The text the user is typing
 * @param locationBias - Optional [lat, lng] to bias results near a location
 */
export const autocompletePlaces = async (
  input: string,
  locationBias?: [number, number]
): Promise<GoongPrediction[]> => {
  if (!input.trim() || !GOONG_API_KEY) return [];

  try {
    const locationParam = locationBias
      ? `&location=${locationBias[0]},${locationBias[1]}`
      : "&location=10.7769,106.7009"; // Default: Ho Chi Minh City

    const url = `${GOONG_BASE_URL}/Place/AutoComplete?api_key=${GOONG_API_KEY}&input=${encodeURIComponent(input)}${locationParam}&radius=50000`;

    const res = await fetch(url);
    const data = await res.json();
    return data.predictions || [];
  } catch (err) {
    console.error("[GoongAPI] Autocomplete error:", err);
    return [];
  }
};

// ─── Geocoding (Address → Coordinates) ───────────────────────────────────────

/**
 * Convert a place_id (from autocomplete) to coordinates and details.
 *
 * @param placeId - The place_id from a GoongPrediction
 * @returns Object with lat, lng and full result or null if not found
 */
export interface GeocodeResult {
  lat: number;
  lng: number;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export const geocodeByPlaceId = async (
  placeId: string
): Promise<GeocodeResult | null> => {
  if (!placeId || !GOONG_API_KEY) return null;

  try {
    const url = `${GOONG_BASE_URL}/Place/Detail?place_id=${placeId}&api_key=${GOONG_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const location = data.result?.geometry?.location;
    if (location) {
      return {
        lat: location.lat,
        lng: location.lng,
        address_components: data.result.address_components || []
      };
    }
    return null;
  } catch (err) {
    console.error("[GoongAPI] Geocode by place_id error:", err);
    return null;
  }
};

/**
 * Convert a free-text address to coordinates.
 * Use geocodeByPlaceId when possible — it is more accurate.
 *
 * @param address - Vietnamese address string
 * @returns [lat, lng] or null if not found
 */
export const geocodeAddress = async (
  address: string
): Promise<[number, number] | null> => {
  if (!address.trim() || !GOONG_API_KEY) return null;

  try {
    const url = `${GOONG_BASE_URL}/Geocode?address=${encodeURIComponent(address)}&api_key=${GOONG_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const result: GoongGeocodeResult = data.results?.[0];
    if (result) {
      const { lat, lng } = result.geometry.location;
      return [lat, lng];
    }
    return null;
  } catch (err) {
    console.error("[GoongAPI] Geocode address error:", err);
    return null;
  }
};

// ─── Reverse Geocoding (Coordinates → Address) ───────────────────────────────

/**
 * Convert coordinates to a human-readable address.
 *
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Formatted address string or null
 */
export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  if (!GOONG_API_KEY) return null;

  try {
    const url = `${GOONG_BASE_URL}/Geocode?latlng=${lat},${lng}&api_key=${GOONG_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    return data.results?.[0]?.formatted_address || null;
  } catch (err) {
    console.error("[GoongAPI] Reverse geocode error:", err);
    return null;
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Check if Goong API keys are configured */
export const isGoongConfigured = (): boolean =>
  Boolean(GOONG_API_KEY && GOONG_MAPTILES_KEY);

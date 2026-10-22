// Geocoding & Proximity Service for SeminarConnect

export interface GeoLocation {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export const INDIAN_CITIES_GEO: Record<string, GeoLocation> = {
  delhi: { city: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.209 },
  "new delhi": { city: "New Delhi", state: "Delhi", lat: 28.6139, lng: 77.209 },
  mumbai: { city: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777 },
  bengaluru: { city: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  bangalore: { city: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  hyderabad: { city: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867 },
  chennai: { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  kolkata: { city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  pune: { city: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  ahmedabad: { city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  jaipur: { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  lucknow: { city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  chandigarh: { city: "Chandigarh", state: "Punjab", lat: 30.7333, lng: 76.7794 },
  bhopal: { city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  indore: { city: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  kochi: { city: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  coimbatore: { city: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  patna: { city: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  bhubaneswar: { city: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245 },
  dehradun: { city: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
  nagpur: { city: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
  surat: { city: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
  visakhapatnam: { city: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
  noida: { city: "Noida", state: "Uttar Pradesh", lat: 28.5355, lng: 77.391 },
  gurugram: { city: "Gurugram", state: "Haryana", lat: 28.4595, lng: 77.0266 },
};

/**
 * Calculates Haversine distance in kilometers between two geo coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Returns estimated coordinates for an Indian city
 */
export function getCoordinatesForCity(city: string): { lat: number; lng: number } {
  const key = city.trim().toLowerCase();
  if (INDIAN_CITIES_GEO[key]) {
    return {
      lat: INDIAN_CITIES_GEO[key].lat,
      lng: INDIAN_CITIES_GEO[key].lng,
    };
  }

  // Fallback defaults to central coordinates (New Delhi)
  return { lat: 28.6139, lng: 77.209 };
}

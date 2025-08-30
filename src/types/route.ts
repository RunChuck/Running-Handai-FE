export interface Coordinate {
  lat: number;
  lng: number;
  ele?: number;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

export interface RouteResponse {
  coordinates: Coordinate[];
  distance: number;
  duration: number;
}

export interface RouteCalculationResult {
  coordinates: Coordinate[];
  geocodedAddresses: GeocodeResult[];
  distance: number;
  duration: number;
}

// OpenRouteService API 응답 타입들
export interface ORSRouteResponse {
  routes: ORSRoute[];
}

export interface ORSRoute {
  geometry: string | ORSGeometry; // encoded polyline 또는 GeoJSON
  summary: {
    distance: number; // meters
    duration: number; // seconds
  };
}

export interface ORSGeometry {
  coordinates: [number, number][]; // [lng, lat] 형태
}

export interface ORSGeocodeResponse {
  features: ORSFeature[];
}

export interface ORSFeature {
  geometry: {
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    label: string;
  };
}

export type RouteProfile = 'foot-walking' | 'cycling-regular' | 'driving-car';

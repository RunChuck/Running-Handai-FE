import type { Coordinate, GeocodeResult, RouteResponse, RouteProfile, ORSRouteResponse, ORSGeocodeResponse } from '@/types/route';

const ORS_API_KEY = import.meta.env.VITE_OPENROUTE_SERVICE_API_KEY;
const ORS_BASE_URL = 'https://api.openrouteservice.org';

// 주소를 좌표로 변환하는 함수 (Geocoding)
export const geocodeAddress = async (address: string): Promise<GeocodeResult | null> => {
  if (!address.trim()) return null;

  try {
    const url = `${ORS_BASE_URL}/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(address)}&boundary.country=KR&size=1`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data: ORSGeocodeResponse = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const [lng, lat] = feature.geometry.coordinates;

      return {
        lat,
        lng,
        displayName: feature.properties.label || address,
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('주소를 찾을 수 없습니다.');
  }
};

// 여러 지점을 경유하는 경로를 계산하는 함수
export const calculateRoute = async (coordinates: Coordinate[], profile: RouteProfile = 'foot-walking'): Promise<RouteResponse> => {
  if (coordinates.length < 2) {
    throw new Error('최소 2개의 지점이 필요합니다.');
  }

  try {
    const url = `${ORS_BASE_URL}/v2/directions/${profile}`;

    const requestBody = {
      coordinates: coordinates.map(coord => [coord.lng, coord.lat]),
      format: 'geojson',
      instructions: false,
      geometry_simplify: false,
      elevation: true,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: ORS_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = new Error(`Route calculation failed with status ${response.status}`) as Error & { status: number };
      error.status = response.status;
      throw error;
    }

    const data: ORSRouteResponse = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error('경로를 찾을 수 없습니다.');
    }

    const route = data.routes[0];

    // geometry 구조 확인 및 처리
    let routeCoordinates: Array<{ lat: number; lng: number; ele?: number }>;

    if (typeof route.geometry === 'string') {
      // encoded polyline - 디코딩 처리 (elevation=true일 때 3D 디코딩)
      const decodedCoords = decodePolyline(route.geometry, true);
      routeCoordinates = decodedCoords.map(coord => {
        if (coord.length === 3) {
          return {
            lat: coord[1],
            lng: coord[0],
            ele: coord[2],
          };
        } else {
          return {
            lat: coord[1],
            lng: coord[0],
          };
        }
      });
    } else if (route.geometry && typeof route.geometry === 'object' && route.geometry.coordinates) {
      // GeoJSON 형태 - 고도 정보 포함 가능
      routeCoordinates = route.geometry.coordinates.map((coord: [number, number] | [number, number, number]) => ({
        lat: coord[1],
        lng: coord[0],
        ele: coord.length > 2 ? coord[2] : undefined,
      }));
    } else {
      throw new Error('알 수 없는 geometry 형식입니다.');
    }

    return {
      coordinates: routeCoordinates,
      distance: route.summary.distance / 1000, // meters to kilometers
      duration: route.summary.duration, // seconds
    };
  } catch (error) {
    console.error('Route calculation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('경로 계산 중 오류가 발생했습니다.');
  }
};

// 마커 좌표가 한국 내에 있는지 확인
export const isLocationInKorea = async (lat: number, lng: number): Promise<boolean> => {
  try {
    const url = `${ORS_BASE_URL}/geocode/reverse?api_key=${ORS_API_KEY}&point.lon=${lng}&point.lat=${lat}&size=1`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const properties = data.features[0].properties;

      // country_a가 "KOR"이거나 country가 "한국"인 경우
      return properties.country_a === 'KOR' || properties.country === '한국';
    }

    // 국가 정보 없으면 false
    return false;
  } catch (error) {
    console.error('Location validation error:', error);
    return false;
  }
};

// 마커들이 모두 대한민국 내에 있는지 확인
export const validateMarkersInKorea = async (coordinates: Coordinate[]): Promise<boolean> => {
  try {
    for (const coord of coordinates) {
      const isInKorea = await isLocationInKorea(coord.lat, coord.lng);
      if (!isInKorea) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Marker validation error:', error);
    return false;
  }
};

// Polyline 디코딩 함수
const decodePolyline = (encoded: string, is3D: boolean = false): Array<[number, number] | [number, number, number]> => {
  const coordinates: Array<[number, number] | [number, number, number]> = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  let elevation = 0;

  while (index < encoded.length) {
    // Decode latitude
    let shift = 0;
    let result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    // Decode longitude
    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    if (is3D && index < encoded.length) {
      // Decode elevation
      shift = 0;
      result = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const deltaElevation = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      elevation += deltaElevation;

      coordinates.push([lng / 1e5, lat / 1e5, elevation / 100]);
    } else {
      coordinates.push([lng / 1e5, lat / 1e5]);
    }
  }
  return coordinates;
};

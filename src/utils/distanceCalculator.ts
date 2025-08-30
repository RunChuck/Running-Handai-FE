export interface Coordinate {
  lat: number;
  lng: number;
}

export interface ElevationData {
  ele?: number;
}

export interface ElevationStats {
  maxAltitude: number;
  minAltitude: number;
}

/**
 * Haversine 공식을 사용해 두 좌표 간의 거리를 계산 (미터 단위)
 */
export const calculateDistanceBetweenPoints = (point1: Coordinate, point2: Coordinate): number => {
  const R = 6371000; // 지구 반지름 (미터)
  const lat1 = (point1.lat * Math.PI) / 180;
  const lat2 = (point2.lat * Math.PI) / 180;
  const deltaLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const deltaLng = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + 
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * 좌표 배열의 총 거리를 계산 (미터 단위)
 */
export const calculateTotalDistance = (coordinates: Coordinate[]): number => {
  if (coordinates.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    totalDistance += calculateDistanceBetweenPoints(coordinates[i - 1], coordinates[i]);
  }
  
  return totalDistance;
};

/**
 * 거리를 킬로미터 단위 자연수로 변환
 */
export const convertToKilometers = (distanceInMeters: number): number => {
  return Math.round(distanceInMeters / 1000);
};

/**
 * 거리와 속도를 기준으로 예상 시간을 계산 (분 단위)
 */
export const calculateEstimatedTime = (distanceInKm: number, speedInKmh: number = 9): number => {
  return Math.round((distanceInKm / speedInKmh) * 60);
};

/**
 * 고도 데이터에서 최고/최저 고도를 계산
 */
export const calculateElevationStats = <T extends ElevationData>(
  coordinates: T[]
): ElevationStats => {
  const elevations = coordinates
    .map(coord => coord.ele)
    .filter(ele => ele !== undefined && !isNaN(ele)) as number[];

  if (elevations.length === 0) {
    return { maxAltitude: 0, minAltitude: 0 };
  }

  return {
    maxAltitude: Math.floor(Math.max(...elevations)),
    minAltitude: Math.floor(Math.min(...elevations)),
  };
};
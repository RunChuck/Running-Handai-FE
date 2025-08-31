import { calculateRoute, geocodeAddress } from '@/api/openroute';
import type { Coordinate, GeocodeResult, RouteCalculationResult, RouteProfile } from '@/types/route';

// 전체 경로 생성 프로세스를 통합하는 함수 (좌표 기반)
export const planRouteFromCoordinates = async (
  coordinates: Coordinate[],
  profile: RouteProfile = 'foot-walking'
): Promise<RouteCalculationResult> => {
  if (coordinates.length < 2) {
    throw new Error('최소 출발지와 도착지를 입력해주세요.');
  }

  const routeResult = await calculateRoute(coordinates, profile);

  return {
    coordinates: routeResult.coordinates,
    geocodedAddresses: [], // 좌표 기반이므로 빈 배열
    distance: routeResult.distance,
    duration: routeResult.duration,
  };
};

// 전체 경로 생성 프로세스를 통합하는 함수 (주소 기반)
export const planRouteFromAddresses = async (addresses: string[], profile: RouteProfile = 'foot-walking'): Promise<RouteCalculationResult> => {
  if (addresses.length < 2) {
    throw new Error('최소 출발지와 도착지를 입력해주세요.');
  }

  // 1단계: 모든 주소를 좌표로 변환
  const geocodedResults: GeocodeResult[] = [];

  for (const address of addresses) {
    const result = await geocodeAddress(address);
    if (!result) {
      throw new Error(`주소를 찾을 수 없습니다: ${address}`);
    }
    geocodedResults.push(result);
  }

  // 2단계: 경로 계산
  const coordinates = geocodedResults.map(result => ({
    lat: result.lat,
    lng: result.lng,
  }));

  const routeResult = await calculateRoute(coordinates, profile);

  return {
    coordinates: routeResult.coordinates,
    geocodedAddresses: geocodedResults,
    distance: routeResult.distance,
    duration: routeResult.duration,
  };
};

// GPX 형식으로 경로 데이터를 변환하는 함수
export const convertToGPX = (coordinates: Coordinate[], routeName: string, geocodedAddresses?: GeocodeResult[]): string => {
  const now = new Date().toISOString();

  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Running Handai" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${routeName}</name>
    <desc>Running Handai로 생성된 경로</desc>
    <time>${now}</time>`;

  if (geocodedAddresses && geocodedAddresses.length > 0) {
    gpxContent += `
    <keywords>출발지: ${geocodedAddresses[0].displayName}`;
    if (geocodedAddresses.length > 2) {
      gpxContent += `, 경유지: ${geocodedAddresses
        .slice(1, -1)
        .map(addr => addr.displayName)
        .join(', ')}`;
    }
    if (geocodedAddresses.length > 1) {
      gpxContent += `, 도착지: ${geocodedAddresses[geocodedAddresses.length - 1].displayName}`;
    }
    gpxContent += `</keywords>`;
  }

  gpxContent += `
  </metadata>
  <trk>
    <name>${routeName}</name>
    <trkseg>`;

  coordinates.forEach(coord => {
    gpxContent += `
      <trkpt lat="${coord.lat}" lon="${coord.lng}">`;

    if (coord.ele !== undefined) {
      gpxContent += `
        <ele>${coord.ele}</ele>`;
    }

    gpxContent += `
        <time>${now}</time>
      </trkpt>`;
  });

  gpxContent += `
    </trkseg>
  </trk>
</gpx>`;

  return gpxContent;
};

// GPX 파일 다운로드 함수
export const downloadGPX = (gpxContent: string, filename: string) => {
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.gpx') ? filename : `${filename}.gpx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// 시간을 읽기 쉬운 형식으로 변환
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  return `${minutes}분`;
};

// 거리를 읽기 쉬운 형식으로 변환
export const formatDistance = (kilometers: number): string => {
  if (kilometers < 1) {
    return `${Math.round(kilometers * 1000)}m`;
  }
  return `${kilometers.toFixed(2)}km`;
};

// 최대/최소 고도 계산 함수
export const calculateElevationStats = (coordinates: Coordinate[]) => {
  const elevations = coordinates.filter(coord => coord.ele !== undefined).map(coord => coord.ele!);

  if (elevations.length === 0) {
    return { maxAltitude: 0, minAltitude: 0 };
  }

  return {
    maxAltitude: Math.max(...elevations),
    minAltitude: Math.min(...elevations),
  };
};

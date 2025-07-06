import type { CourseDetailResponse } from '@/types/course';

export interface MapPoint {
  lat: number;
  lng: number;
  ele?: number;
}

export interface CourseRoute {
  courseId: number;
  points: MapPoint[];
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  center: {
    lat: number;
    lng: number;
  };
}

/**
 * API에서 받은 trackPoints를 지도용 데이터로 변환
 */
export const convertTrackPointsToRoute = (courseDetail: CourseDetailResponse['data']): CourseRoute => {
  const points: MapPoint[] = courseDetail.trackPoints.map(point => ({
    lat: point.lat,
    lng: point.lon,
    ele: point.ele,
  }));

  // 경계 계산
  const lats = points.map(p => p.lat);
  const lngs = points.map(p => p.lng);

  const bounds = {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };

  // 시작 포인트를 중심으로 설정
  const center =
    points.length > 0
      ? {
          lat: points[0].lat,
          lng: points[0].lng,
        }
      : {
          lat: (bounds.minLat + bounds.maxLat) / 2,
          lng: (bounds.minLng + bounds.maxLng) / 2,
        };

  return {
    courseId: courseDetail.courseId,
    points,
    bounds,
    center,
  };
};

/**
 * 카카오맵에 경로 그리기
 */
export const drawRouteOnMap = (map: kakao.maps.Map, route: CourseRoute): kakao.maps.Polyline => {
  // 경로 포인트를 카카오맵 좌표로 변환
  const path = route.points.map(point => new window.kakao.maps.LatLng(point.lat, point.lng));

  // 폴리라인 생성
  const polyline = new window.kakao.maps.Polyline({
    path: path,
    strokeWeight: 6,
    strokeColor: '#4561FF',
    strokeOpacity: 0.8,
    strokeStyle: 'solid',
  });

  // 지도에 폴리라인 표시
  polyline.setMap(map);

  // 시작 포인트로 지도 중심 이동
  const centerPosition = new window.kakao.maps.LatLng(route.center.lat, route.center.lng);
  map.setCenter(centerPosition);

  return polyline;
};

/**
 * 경로가 모두 보이도록 지도 범위 조정
 */
export const fitMapToBounds = (map: kakao.maps.Map, route: CourseRoute): void => {
  if (route.points.length === 0) return;

  const bounds = new window.kakao.maps.LatLngBounds();

  route.points.forEach(point => {
    bounds.extend(new window.kakao.maps.LatLng(point.lat, point.lng));
  });

  map.setBounds(bounds);
};

import type { CourseData } from '@/types/course';
import { renderToString } from 'react-dom/server';
import CustomMarker from '@/components/CustomMarker';

export interface MultiCourseMapData {
  courseId: number;
  courseIndex: number; // A=0, B=1, C=2...
  label: string; // 'A', 'B', 'C'...
  points: Array<{ lat: number; lng: number; ele?: number }>;
  color: string;
  isSelected: boolean;
}

export interface CourseMapElements {
  polylines: kakao.maps.Polyline[];
  markers: kakao.maps.Marker[];
}

/**
 * 여러 코스를 지도용 데이터로 변환
 */
export const convertCoursesToMapData = (courses: CourseData[], selectedCourseId?: number): MultiCourseMapData[] => {
  return courses.map((course, index) => ({
    courseId: course.courseId,
    courseIndex: index,
    label: String.fromCharCode(65 + index), // A, B, C...
    points:
      course.trackPoints?.map(point => ({
        lat: point.lat,
        lng: point.lon,
        ele: point.ele,
      })) || [],
    color: course.courseId === selectedCourseId ? '#4561FF' : '#71737E',
    isSelected: course.courseId === selectedCourseId,
  }));
};

/**
 * 지도에 여러 코스 경로 그리기
 */
export const drawMultipleCoursesOnMap = (map: kakao.maps.Map, coursesData: MultiCourseMapData[]): CourseMapElements => {
  const polylines: kakao.maps.Polyline[] = [];
  const markers: kakao.maps.Marker[] = [];

  // 선택된 코스는 마지막에 그리기
  const sortedCoursesData = [...coursesData].sort((a, b) => {
    if (a.isSelected === b.isSelected) return 0;
    return a.isSelected ? 1 : -1;
  });

  sortedCoursesData.forEach(courseData => {
    if (courseData.points.length === 0) return;

    // 폴리라인 생성
    const path = courseData.points.map(point => new window.kakao.maps.LatLng(point.lat, point.lng));

    const polyline = new window.kakao.maps.Polyline({
      path: path,
      strokeWeight: courseData.isSelected ? 6 : 4,
      strokeColor: courseData.color,
      strokeOpacity: courseData.isSelected ? 0.9 : 0.7,
      strokeStyle: 'solid',
      zIndex: courseData.isSelected ? 100 : 1,
    });

    polyline.setMap(map);
    polylines.push(polyline);

    // 시작점에 마커 생성
    const startPoint = courseData.points[0];
    const markerPosition = new window.kakao.maps.LatLng(startPoint.lat, startPoint.lng);

    // 커스텀 마커 이미지 생성
    const markerImageSrc = createMarkerImageDataURL(courseData.label, courseData.color, courseData.isSelected);
    const imageSize = new window.kakao.maps.Size(26, 32);
    const imageOption = { offset: new window.kakao.maps.Point(13, 32) };
    const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption);

    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
      title: `${courseData.label}코스`,
      zIndex: courseData.isSelected ? 100 : 1,
    });

    // 마커에 코스 데이터 저장 (클러스터 클릭시 사용)
    (marker as unknown as { courseData: MultiCourseMapData }).courseData = courseData;

    marker.setMap(map);
    markers.push(marker);
  });

  return { polylines, markers };
};

/**
 * 마커 클러스터러 생성
 */
export const createMarkerClusterer = (
  map: kakao.maps.Map,
  onClusterClick?: (courses: Array<{ courseId: number; label: string; title: string }>, position: { x: number; y: number }) => void,
  mapContainer?: HTMLElement
): kakao.maps.MarkerClusterer | null => {
  // 클러스터러 라이브러리가 로드되었는지 확인
  if (!window.kakao?.maps?.MarkerClusterer) {
    console.error('MarkerClusterer 라이브러리 로드 오류');
    return null;
  }

  const clusterer = new window.kakao.maps.MarkerClusterer({
    map: map,
    averageCenter: true,
    minLevel: 1,
    disableClickZoom: true, // 확대 비활성화하여 바로 팝오버 표시
    minClusterSize: 2,
    gridSize: 40, // 반경 40px 내 마커들 클러스터링
  });

  // 클러스터 클릭 이벤트
  if (onClusterClick) {
    window.kakao.maps.event.addListener(clusterer, 'clusterclick', (cluster: kakao.maps.Cluster) => {
      showClusterPopover(cluster, onClusterClick, map, mapContainer);
    });
  }

  return clusterer;
};

/**
 * 클러스터 클릭시 팝오버 표시
 */
const showClusterPopover = (
  cluster: kakao.maps.Cluster,
  onClusterClick: (courses: Array<{ courseId: number; label: string; title: string }>, position: { x: number; y: number }) => void,
  map: kakao.maps.Map,
  mapContainer?: HTMLElement
) => {
  const markers = cluster.getMarkers();
  const courses = markers.map((marker: kakao.maps.Marker & { courseData?: MultiCourseMapData }) => ({
    courseId: marker.courseData.courseId,
    label: marker.courseData.label,
    title: `${marker.courseData.label}코스`,
  }));

  // 클러스터 중심점을 지도 내부 좌표로 변환
  const clusterPosition = cluster.getCenter();
  const mapBounds = map.getBounds();

  // 지도 경계 내에서의 상대적 위치 계산 (0~1 비율)
  const swLatLng = mapBounds.getSouthWest();
  const neLatLng = mapBounds.getNorthEast();

  const latRange = neLatLng.getLat() - swLatLng.getLat();
  const lngRange = neLatLng.getLng() - swLatLng.getLng();

  const relativeX = (clusterPosition.getLng() - swLatLng.getLng()) / lngRange;
  const relativeY = (neLatLng.getLat() - clusterPosition.getLat()) / latRange; // Y축은 반전

  // 실제 지도 컨테이너 크기 가져오기
  let mapWidth = 600;
  let mapHeight = 400;

  if (mapContainer) {
    const rect = mapContainer.getBoundingClientRect();
    mapWidth = rect.width;
    mapHeight = rect.height;
  }

  const position = {
    x: relativeX * mapWidth,
    y: relativeY * mapHeight - 26, // 클러스터 위쪽에 표시
  };

  onClusterClick(courses, position);
};

/**
 * 코스 선택 변경 시 스타일 업데이트
 */
export const updateCourseSelection = (
  map: kakao.maps.Map,
  elements: CourseMapElements,
  coursesData: MultiCourseMapData[],
  newSelectedCourseId: number
): CourseMapElements => {
  // 기존 요소들 제거
  clearMapElements(elements);

  // 새로운 선택 상태로 데이터 업데이트
  const updatedCoursesData = coursesData.map(course => ({
    ...course,
    color: course.courseId === newSelectedCourseId ? '#4561FF' : '#71737E',
    isSelected: course.courseId === newSelectedCourseId,
  }));

  return drawMultipleCoursesOnMap(map, updatedCoursesData);
};

/**
 * 지도 요소들 제거
 */
export const clearMapElements = (elements: CourseMapElements): void => {
  elements.polylines.forEach(polyline => polyline.setMap(null));
  elements.markers.forEach(marker => marker.setMap(null));
};

/**
 * 모든 코스가 보이도록 지도 범위 조정
 */
export const fitMapToAllCourses = (map: kakao.maps.Map, coursesData: MultiCourseMapData[]): void => {
  if (coursesData.length === 0) return;

  const bounds = new window.kakao.maps.LatLngBounds();
  let hasPoints = false;

  coursesData.forEach(course => {
    course.points.forEach(point => {
      bounds.extend(new window.kakao.maps.LatLng(point.lat, point.lng));
      hasPoints = true;
    });
  });

  if (hasPoints) {
    map.setBounds(bounds);
  }
};

/**
 * React 컴포넌트를 활용한 SVG 마커 이미지 생성
 */
const createMarkerImageDataURL = (label: string, _color: string, isSelected: boolean): string => {
  // React 컴포넌트를 HTML 문자열로 렌더링
  const svgString = renderToString(CustomMarker({ label, isSelected }));

  // SVG를 data URL로 변환
  const encodedSvg = encodeURIComponent(svgString);
  return `data:image/svg+xml,${encodedSvg}`;
};

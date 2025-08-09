import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { BUSAN_CITY_HALL, DEFAULT_MAP_LEVEL } from '@/constants/locations';
import { getUserLocation, type LocationCoords } from '@/utils/geolocation';
import {
  convertCoursesToMapData,
  drawMultipleCoursesOnMap,
  updateCourseSelection,
  clearMapElements,
  createMarkerClusterer,
  type CourseMapElements,
  type MultiCourseMapData,
} from '@/utils/multiCourseUtils';
import type { CourseData } from '@/types/course';
import CoursePopover from './CoursePopover';

export interface MapViewRef {
  moveToLocation: (lat: number, lng: number, level?: number) => void;
  displayCourses: (courses: CourseData[], selectedCourseId?: number) => void;
  updateSelectedCourse: (courseId: number) => void;
  clearAllCourses: () => void;
}

interface MapViewProps {
  onMapLoad?: (map: kakao.maps.Map) => void;
  onCourseMarkerClick?: (courseId: number) => void;
  containerHeight?: number;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

const MapView = forwardRef<MapViewRef, MapViewProps>(({ onMapLoad, onCourseMarkerClick, containerHeight, initialCenter, initialZoom }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);
  const courseElements = useRef<CourseMapElements>({ polylines: [], markers: [] });
  const currentCoursesData = useRef<MultiCourseMapData[]>([]);
  const isMapInitialized = useRef(false);
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const clusterer = useRef<kakao.maps.MarkerClusterer | null>(null);

  const [popover, setPopover] = useState<{
    visible: boolean;
    courses: Array<{ courseId: number; label: string; title: string }>;
    position: { x: number; y: number };
  }>({ visible: false, courses: [], position: { x: 0, y: 0 } });

  const onCourseMarkerClickCallback = useCallback(
    (courseId: number) => {
      if (onCourseMarkerClick) {
        onCourseMarkerClick(courseId);
      }
    },
    [onCourseMarkerClick]
  );

  const onMapLoadCallback = useCallback(
    (map: kakao.maps.Map) => {
      if (onMapLoad) {
        onMapLoad(map);
      }
    },
    [onMapLoad]
  );

  // 지도 초기 위치 설정
  const getInitialLocation = async () => {
    // props로 전달받은 초기 위치가 있으면 우선 사용 (복원된 위치)
    if (initialCenter) {
      console.log('복원된 지도 위치 사용:', initialCenter);
      return { location: initialCenter, isUserLocation: false, isRestored: true };
    }

    try {
      const location = await getUserLocation();
      return { location, isUserLocation: true, isRestored: false };
    } catch {
      console.log('부산 시청 좌표 사용:', BUSAN_CITY_HALL);
      return { location: BUSAN_CITY_HALL, isUserLocation: false, isRestored: false };
    }
  };

  // 현재 위치에 마커 표시
  const addLocationMarker = (map: kakao.maps.Map, location: LocationCoords, isUserLocation: boolean) => {
    const position = new window.kakao.maps.LatLng(location.lat, location.lng);

    if (isUserLocation) {
      const accuracyOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: `
          <div style="
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: rgba(0, 87, 255, 0.2);
            border: 1px solid rgba(0, 87, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <div style="
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: #FF460D;
              border: 2px solid #FFF;
              box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
            "></div>
          </div>
        `,
        yAnchor: 0.5,
        xAnchor: 0.5,
        zIndex: 10,
      });

      accuracyOverlay.setMap(map);
    }
  };

  // 외부에서 호출할 수 있는 함수들
  useImperativeHandle(ref, () => ({
    moveToLocation: (lat: number, lng: number, level?: number) => {
      if (mapInstance.current) {
        const position = new window.kakao.maps.LatLng(lat, lng);

        if (level !== undefined) {
          mapInstance.current.setLevel(level);
          setTimeout(() => {
            if (mapInstance.current) {
              mapInstance.current.panTo(position);
            }
          }, 200);
        } else {
          mapInstance.current.panTo(position);
        }
      } else {
        console.error('MapView: mapInstance.current가 null입니다');
      }
    },

    displayCourses: (courses: CourseData[], selectedCourseId?: number) => {
      if (!mapInstance.current) {
        console.error('MapView: 지도가 초기화되지 않았습니다');
        return;
      }

      // 기존 코스 요소들 및 클러스터러 제거
      clearMapElements(courseElements.current);
      if (clusterer.current) {
        clusterer.current.clear();
      }

      // 새로운 코스 데이터 변환
      const coursesData = convertCoursesToMapData(courses, selectedCourseId);
      currentCoursesData.current = coursesData;

      const handleClusterClick = (courses: Array<{ courseId: number; label: string; title: string }>, position: { x: number; y: number }) => {
        // 지도 컨테이너 기준으로 위치 조정
        const mapRect = mapContainer.current?.getBoundingClientRect();
        let adjustedPosition = position;

        if (mapRect) {
          adjustedPosition = {
            x: Math.min(Math.max(position.x, 60), mapRect.width - 60), // 지도 경계 내로 제한
            y: Math.max(position.y, 40), // 상단 경계 고려
          };
        }

        setPopover({
          visible: true,
          courses,
          position: adjustedPosition,
        });
      };

      // 지도에 코스들 그리기
      courseElements.current = drawMultipleCoursesOnMap(mapInstance.current, coursesData);

      // 클러스터러 생성 및 마커 추가
      clusterer.current = createMarkerClusterer(mapInstance.current, handleClusterClick, mapContainer.current || undefined);
      if (clusterer.current) {
        clusterer.current.addMarkers(courseElements.current.markers);
      } else {
        console.warn('클러스터러를 사용할 수 없어 기본 마커로 표시합니다');
      }

      // 개별 마커 클릭 이벤트 등록
      courseElements.current.markers.forEach((marker, index) => {
        const courseData = coursesData[index];
        window.kakao.maps.event.addListener(marker, 'click', () => {
          setPopover({ visible: false, courses: [], position: { x: 0, y: 0 } });
          onCourseMarkerClickCallback(courseData.courseId);
        });
      });
    },

    updateSelectedCourse: (courseId: number) => {
      if (!mapInstance.current || currentCoursesData.current.length === 0) {
        console.error('MapView: 지도 또는 코스 데이터가 준비되지 않았습니다');
        return;
      }

      // 선택 상태 업데이트
      courseElements.current = updateCourseSelection(mapInstance.current, courseElements.current, currentCoursesData.current, courseId);

      currentCoursesData.current = currentCoursesData.current.map(course => ({
        ...course,
        color: course.courseId === courseId ? '#4561FF' : '#71737E',
        isSelected: course.courseId === courseId,
      }));

      // 클러스터러에 새로운 마커들 추가
      if (clusterer.current) {
        clusterer.current.clear();
        clusterer.current.addMarkers(courseElements.current.markers);
      }

      // 마커 클릭 이벤트 재등록
      courseElements.current.markers.forEach((marker, index) => {
        const courseData = currentCoursesData.current[index];
        window.kakao.maps.event.addListener(marker, 'click', () => {
          setPopover({ visible: false, courses: [], position: { x: 0, y: 0 } });
          onCourseMarkerClickCallback(courseData.courseId);
        });
      });

      // console.log(`코스 선택 변경: ${courseId}`);
    },

    clearAllCourses: () => {
      clearMapElements(courseElements.current);
      if (clusterer.current) {
        clusterer.current.clear();
      }
      currentCoursesData.current = [];
      setPopover({ visible: false, courses: [], position: { x: 0, y: 0 } });
    },

    // 지도 크기 재조정 함수
    recenterMap: () => {
      if (mapInstance.current) {
        const center = mapInstance.current.getCenter();
        const level = mapInstance.current.getLevel();

        mapInstance.current.relayout();
        mapInstance.current.setCenter(center);
        mapInstance.current.setLevel(level);
      }
    },
  }));

  // containerHeight 변경 시 지도 크기 재조정
  useEffect(() => {
    if (mapInstance.current && containerHeight !== undefined) {
      const center = mapInstance.current.getCenter();
      const level = mapInstance.current.getLevel();

      // 지도 재레이아웃 및 중심점 유지
      mapInstance.current.relayout();
      mapInstance.current.setCenter(center);
      mapInstance.current.setLevel(level);
    }
  }, [containerHeight]);

  // 지도 초기화
  useEffect(() => {
    if (!mapContainer.current || isMapInitialized.current) return;

    console.log('지도 초기화 시작...');

    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false&libraries=clusterer,drawing`;

    console.log('Loading script:', mapScript.src);

    const onLoadKakaoMap = async () => {
      console.log('Kakao map script 로드 완료');
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(async () => {
          const container = mapContainer.current;
          if (!container || isMapInitialized.current) return;

          const { location: initialLocation, isUserLocation: isCurrentUserLocation, isRestored } = await getInitialLocation();

          const options = {
            center: new window.kakao.maps.LatLng(initialLocation.lat, initialLocation.lng),
            level: initialZoom || DEFAULT_MAP_LEVEL, // 복원된 줌 레벨 사용
          };

          const map = new window.kakao.maps.Map(container, options);
          mapInstance.current = map;
          isMapInitialized.current = true; // 초기화 완료 표시

          // 복원된 위치가 아닌 경우에만 현재 위치 마커 표시
          if (!isRestored) {
            addLocationMarker(map, initialLocation, isCurrentUserLocation);
          }

          console.log('지도 초기화 완료. 중심 좌표:', initialLocation);
          console.log('사용자 위치 여부:', isCurrentUserLocation);

          // 클러스터러 라이브러리 로드 확인
          console.log('Kakao maps loaded. MarkerClusterer available:', !!window.kakao?.maps?.MarkerClusterer);

          // 부모 컴포넌트에 map 인스턴스 전달
          onMapLoadCallback(map);
        });
      } else {
        console.error('Kakao maps object not found');
      }
    };

    const onErrorKakaoMap = (error: Event) => {
      console.error('Failed to load Kakao map script:', error);
      console.error('Script src:', mapScript.src);
    };

    mapScript.addEventListener('load', onLoadKakaoMap);
    mapScript.addEventListener('error', onErrorKakaoMap);

    document.head.appendChild(mapScript);

    return () => {
      mapScript.removeEventListener('load', onLoadKakaoMap);
      mapScript.removeEventListener('error', onErrorKakaoMap);
      if (document.head.contains(mapScript)) {
        document.head.removeChild(mapScript);
      }

      // 정리
      clearMapElements(courseElements.current);
      isMapInitialized.current = false;

      // ResizeObserver 정리
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  return (
    <MapWrapper>
      <MapContainer ref={mapContainer} containerHeight={containerHeight} />
      {popover.visible && (
        <CoursePopover
          courses={popover.courses}
          position={popover.position}
          onSelect={onCourseMarkerClickCallback}
          onClose={() => setPopover({ visible: false, courses: [], position: { x: 0, y: 0 } })}
        />
      )}
    </MapWrapper>
  );
});

MapView.displayName = 'MapView';

export default MapView;

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.div<{ containerHeight?: number }>`
  width: 100%;
  height: ${({ containerHeight }) => (containerHeight ? `${containerHeight + 12}px` : '100%')};
`;

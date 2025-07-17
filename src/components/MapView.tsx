import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import styled from '@emotion/styled';
import { BUSAN_CITY_HALL, DEFAULT_MAP_LEVEL } from '@/constants/locations';
import { getUserLocation, type LocationCoords } from '@/utils/geolocation';
import {
  convertCoursesToMapData,
  drawMultipleCoursesOnMap,
  updateCourseSelection,
  clearMapElements,
  type CourseMapElements,
  type MultiCourseMapData,
} from '@/utils/multiCourseUtils';
import type { CourseData } from '@/types/course';

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
}

const MapView = forwardRef<MapViewRef, MapViewProps>(({ onMapLoad, onCourseMarkerClick, containerHeight }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);
  const courseElements = useRef<CourseMapElements>({ polylines: [], markers: [] });
  const currentCoursesData = useRef<MultiCourseMapData[]>([]);
  const isMapInitialized = useRef(false);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  // 콜백 함수들을 useCallback으로 메모이제이션
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
    try {
      const location = await getUserLocation();
      return { location, isUserLocation: true };
    } catch {
      console.log('부산 시청 좌표 사용:', BUSAN_CITY_HALL);
      return { location: BUSAN_CITY_HALL, isUserLocation: false };
    }
  };

  // 현재 위치에 마커 표시
  const addLocationMarker = (map: kakao.maps.Map, location: LocationCoords, isUserLocation: boolean) => {
    const position = new window.kakao.maps.LatLng(location.lat, location.lng);

    if (isUserLocation) {
      const accuracyCircle = new window.kakao.maps.Circle({
        center: position,
        radius: 100,
        strokeWeight: 0,
        strokeOpacity: 0,
        fillColor: '#0057FF',
        fillOpacity: 0.2,
      });

      accuracyCircle.setMap(map);

      const centerDot = new window.kakao.maps.Circle({
        center: position,
        radius: 8,
        strokeWeight: 2,
        strokeColor: '#FFF',
        strokeOpacity: 1,
        fillColor: '#FF460D',
        fillOpacity: 1,
      });

      centerDot.setMap(map);
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

      // 기존 코스 요소들 제거
      clearMapElements(courseElements.current);

      // 새로운 코스 데이터 변환
      const coursesData = convertCoursesToMapData(courses, selectedCourseId);
      currentCoursesData.current = coursesData;

      console.log('변환된 코스 데이터:', coursesData);

      // 지도에 코스들 그리기
      courseElements.current = drawMultipleCoursesOnMap(mapInstance.current, coursesData);

      console.log('그려진 요소들:', {
        polylines: courseElements.current.polylines.length,
        markers: courseElements.current.markers.length,
      });

      // 마커 클릭 이벤트 등록
      courseElements.current.markers.forEach((marker, index) => {
        const courseData = coursesData[index];
        window.kakao.maps.event.addListener(marker, 'click', () => {
          onCourseMarkerClickCallback(courseData.courseId);
        });
      });

      // 모든 코스가 보이도록 지도 범위 조정
      // if (coursesData.length > 0) {
      //   setTimeout(() => {
      //     if (mapInstance.current) {
      //       fitMapToAllCourses(mapInstance.current, coursesData);
      //     }
      //   }, 100);
      // }

      // console.log(`${courses.length}개 코스 표시 완료`, coursesData);
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

      // 마커 클릭 이벤트 재등록
      courseElements.current.markers.forEach((marker, index) => {
        const courseData = currentCoursesData.current[index];
        window.kakao.maps.event.addListener(marker, 'click', () => {
          onCourseMarkerClickCallback(courseData.courseId);
        });
      });

      console.log(`코스 선택 변경: ${courseId}`);
    },

    clearAllCourses: () => {
      clearMapElements(courseElements.current);
      currentCoursesData.current = [];
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
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;

    console.log('Loading script:', mapScript.src);

    const onLoadKakaoMap = async () => {
      console.log('Kakao map script 로드 완료');
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(async () => {
          const container = mapContainer.current;
          if (!container || isMapInitialized.current) return;

          const { location: initialLocation, isUserLocation: isCurrentUserLocation } = await getInitialLocation();

          const options = {
            center: new window.kakao.maps.LatLng(initialLocation.lat, initialLocation.lng),
            level: DEFAULT_MAP_LEVEL,
          };

          const map = new window.kakao.maps.Map(container, options);
          mapInstance.current = map;
          isMapInitialized.current = true; // 초기화 완료 표시

          // 위치에 마커 표시
          addLocationMarker(map, initialLocation, isCurrentUserLocation);

          console.log('지도 초기화 완료. 중심 좌표:', initialLocation);
          console.log('사용자 위치 여부:', isCurrentUserLocation);

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

  return <MapContainer ref={mapContainer} containerHeight={containerHeight} />;
});

MapView.displayName = 'MapView';

export default MapView;

const MapContainer = styled.div<{ containerHeight?: number }>`
  width: 100%;
  height: ${({ containerHeight }) => (containerHeight ? `${containerHeight + 12}px` : '100%')};
`;

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styled from '@emotion/styled';
import { BUSAN_CITY_HALL, DEFAULT_MAP_LEVEL } from '@/constants/locations';
import { getUserLocation, type LocationCoords } from '@/utils/geolocation';

export interface MapViewRef {
  moveToLocation: (lat: number, lng: number, level?: number) => void;
}

interface MapViewProps {
  onMapLoad?: (map: kakao.maps.Map) => void;
}

const MapView = forwardRef<MapViewRef, MapViewProps>(({ onMapLoad }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);

  // 지도 초기 위치 설정
  const getInitialLocation = async () => {
    try {
      const location = await getUserLocation();
      return { location, isUserLocation: true };
    } catch {
      // 위치 접근 거부 또는 실패시 부산 시청 좌표 사용
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
    } else {
      const marker = new window.kakao.maps.Marker({
        position: position,
      });

      marker.setMap(map);
    }
  };

  // 외부에서 호출할 수 있는 함수들
  useImperativeHandle(ref, () => ({
    moveToLocation: (lat: number, lng: number, level?: number) => {
      if (mapInstance.current) {
        const position = new window.kakao.maps.LatLng(lat, lng);

        if (level !== undefined) {
          mapInstance.current.setLevel(level);

          // zoom level 먼저 변경 후 위치 이동
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
  }));

  // 지도 초기화
  useEffect(() => {
    if (!mapContainer.current) return;

    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;

    console.log('Loading script:', mapScript.src);

    const onLoadKakaoMap = async () => {
      console.log('Kakao map script 로드 완료');
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(async () => {
          const container = mapContainer.current;
          if (!container) return;

          const { location: initialLocation, isUserLocation: isCurrentUserLocation } = await getInitialLocation();

          const options = {
            center: new window.kakao.maps.LatLng(initialLocation.lat, initialLocation.lng),
            level: DEFAULT_MAP_LEVEL,
          };

          const map = new window.kakao.maps.Map(container, options);
          mapInstance.current = map;

          // 위치에 마커 표시
          addLocationMarker(map, initialLocation, isCurrentUserLocation);

          console.log('지도 초기화 완료. 중심 좌표:', initialLocation);
          console.log('사용자 위치 여부:', isCurrentUserLocation);

          // 부모 컴포넌트에 map 인스턴스 전달
          if (onMapLoad) {
            onMapLoad(map);
          }
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
    };
  }, [onMapLoad]);

  return <MapContainer ref={mapContainer} />;
});

MapView.displayName = 'MapView';

export default MapView;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

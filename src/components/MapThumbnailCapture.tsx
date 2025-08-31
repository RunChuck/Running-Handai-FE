import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styled from '@emotion/styled';
import { BUSAN_CITY_HALL } from '@/constants/locations';

interface MapThumbnailCaptureProps {
  coordinates?: { lat: number; lng: number }[];
  zoomLevel?: number;
  onZoomChange?: (level: number) => void;
}

export interface MapThumbnailCaptureRef {
  updateRoute: (coordinates: { lat: number; lng: number }[]) => void;
  setZoom: (level: number) => void;
}

const MapThumbnailCapture = forwardRef<MapThumbnailCaptureRef, MapThumbnailCaptureProps>(({ coordinates = [], zoomLevel = 5, onZoomChange }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);
  const polylineRef = useRef<kakao.maps.Polyline | null>(null);
  const isMapInitialized = useRef(false);

  useImperativeHandle(ref, () => ({
    updateRoute: (newCoordinates: { lat: number; lng: number }[]) => {
      displayRoute(newCoordinates);
    },
    setZoom: (level: number) => {
      if (mapInstance.current) {
        mapInstance.current.setLevel(level);
      }
    },
  }));

  const displayRoute = (routeCoordinates: { lat: number; lng: number }[]) => {
    if (!mapInstance.current || routeCoordinates.length < 2) return;

    // 기존 경로 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // 좌표를 카카오맵 LatLng 객체로 변환
    const path = routeCoordinates.map(coord => new window.kakao.maps.LatLng(coord.lat, coord.lng));

    // 폴리라인 생성 (썸네일용으로 더 굵게)
    const polyline = new window.kakao.maps.Polyline({
      path: path,
      strokeWeight: 4,
      strokeColor: '#4561FF',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    // 지도에 폴리라인 표시
    polyline.setMap(mapInstance.current);
    polylineRef.current = polyline;

    // 경로가 모두 보이도록 지도 영역 조정
    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach(latlng => bounds.extend(latlng));
    mapInstance.current.setBounds(bounds);

    // 현재 줌 레벨을 부모에게 알림
    if (onZoomChange) {
      onZoomChange(mapInstance.current.getLevel());
    }
  };

  useEffect(() => {
    if (!mapContainer.current || isMapInitialized.current) return;

    const initMap = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = mapContainer.current;
          if (!container || isMapInitialized.current) return;

          // 기본 중심점 설정 (부산시청 또는 첫 번째 좌표)
          const center =
            coordinates.length > 0
              ? new window.kakao.maps.LatLng(coordinates[0].lat, coordinates[0].lng)
              : new window.kakao.maps.LatLng(BUSAN_CITY_HALL.lat, BUSAN_CITY_HALL.lng);

          const options = {
            center,
            level: zoomLevel,
            draggable: false, // 썸네일은 드래그 불가
            scrollwheel: false, // 스크롤 줌 불가
            disableDoubleClick: true, // 더블클릭 줌 불가
            disableDoubleClickZoom: true,
          };

          const map = new window.kakao.maps.Map(container, options);
          mapInstance.current = map;
          isMapInitialized.current = true;

          // 줌 레벨 변경 이벤트 등록
          window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
            if (onZoomChange) {
              onZoomChange(map.getLevel());
            }
          });

          // 초기 경로 표시
          if (coordinates.length > 0) {
            displayRoute(coordinates);
          }
        });
      }
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      const mapScript = document.createElement('script');
      mapScript.async = true;
      mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;
      mapScript.addEventListener('load', initMap);
      document.head.appendChild(mapScript);

      return () => {
        if (document.head.contains(mapScript)) {
          document.head.removeChild(mapScript);
        }
      };
    }
  }, []);

  // zoomLevel prop이 변경될 때 지도 줌 레벨 업데이트
  useEffect(() => {
    if (mapInstance.current && zoomLevel !== undefined) {
      mapInstance.current.setLevel(zoomLevel);
    }
  }, [zoomLevel]);

  // coordinates가 변경될 때 경로 업데이트
  useEffect(() => {
    if (coordinates.length > 0) {
      displayRoute(coordinates);
    }
  }, [coordinates]);

  return <ThumbnailMapContainer ref={mapContainer} />;
});

MapThumbnailCapture.displayName = 'MapThumbnailCapture';

export default MapThumbnailCapture;

const ThumbnailMapContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
`;

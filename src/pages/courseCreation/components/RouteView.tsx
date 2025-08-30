import { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import Lottie from 'lottie-react';
import { BUSAN_CITY_HALL, DEFAULT_MAP_LEVEL } from '@/constants/locations';
import { getUserLocation, type LocationCoords } from '@/utils/geolocation';

import LoadingMotion from '@/assets/animations/run-loading.json';
import CustomMarker from '@/components/CustomMarker';
import CircleMarker from '@/components/CircleMarker';

interface MarkerData {
  id: string;
  position: { lat: number; lng: number };
  marker: kakao.maps.Marker;
}

export interface RouteViewMapInstance {
  moveToLocation: (lat: number, lng: number, level?: number) => void;
  clearAllMarkers: () => void;
  removeLastMarker: () => void;
  addMarkerAt: (lat: number, lng: number) => void;
  moveMarkerTo: (index: number, lat: number, lng: number) => void;
  swapMarkers: (newMarkers: { lat: number; lng: number }[]) => void;
  getMarkers: () => { lat: number; lng: number }[];
  displayRoute: (coordinates: { lat: number; lng: number }[]) => void;
  clearRoute: () => void;
}

interface RouteViewProps {
  onMapLoad?: (map: RouteViewMapInstance) => void;
  onMarkersChange?: (markers: { lat: number; lng: number }[]) => void;
  isRouteGenerated?: boolean;
}

const RouteView = ({ onMapLoad, onMarkersChange, isRouteGenerated = false }: RouteViewProps) => {
  const [t] = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<MarkerData[]>([]);
  const routePolylineRef = useRef<kakao.maps.Polyline | null>(null);
  const mapClickListenerRef = useRef<kakao.maps.event.EventHandle | null>(null);
  const isRouteGeneratedRef = useRef(isRouteGenerated);
  const isMapInitialized = useRef(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // isRouteGenerated가 변경될 때마다 ref 업데이트
  isRouteGeneratedRef.current = isRouteGenerated;

  const getInitialLocation = async (): Promise<LocationCoords> => {
    try {
      return await getUserLocation();
    } catch {
      return BUSAN_CITY_HALL;
    }
  };

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
              width: 14px;
              height: 14px;
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

  const createRouteMarker = (position: kakao.maps.LatLng, index: number): MarkerData => {
    const isFirstMarker = index === 0;
    const isLastMarker = index === markersRef.current.length;
    const totalMarkers = markersRef.current.length + 1;
    const isDestination = totalMarkers >= 2 && isLastMarker;

    // 커스텀 마커 이미지 생성
    let markerContent;
    if (isFirstMarker) {
      markerContent = ReactDOMServer.renderToString(<CustomMarker label={t('courseCreation.marker.start')} isSelected={true} fontSize={11} />);
    } else {
      markerContent = ReactDOMServer.renderToString(<CircleMarker number={index} isDestination={isDestination} />);
    }

    const markerSize = isFirstMarker ? new window.kakao.maps.Size(26, 32) : new window.kakao.maps.Size(22, 22);
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${markerSize.width}" height="${markerSize.height}" viewBox="0 0 ${markerSize.width} ${markerSize.height}">${markerContent}</svg>`;
    const encodedSvg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

    const markerImage = new window.kakao.maps.MarkerImage(encodedSvg, markerSize, {
      offset: isFirstMarker ? new window.kakao.maps.Point(13, 32) : new window.kakao.maps.Point(11, 11),
    });

    const marker = new window.kakao.maps.Marker({
      position: position,
      draggable: !isRouteGenerated, // 경로 생성 후에는 드래그 불가
      image: markerImage,
    });

    const markerId = `marker_${Date.now()}_${Math.random()}`;
    const markerData: MarkerData = {
      id: markerId,
      position: { lat: position.getLat(), lng: position.getLng() },
      marker: marker,
    };

    return markerData;
  };

  const addMarker = (position: kakao.maps.LatLng) => {
    console.log('🔍 addMarker 호출:', { isRouteGenerated: isRouteGeneratedRef.current, hasMapInstance: !!mapInstance.current });
    if (!mapInstance.current || isRouteGeneratedRef.current) return;

    const currentIndex = markersRef.current.length;
    const markerData = createRouteMarker(position, currentIndex);
    markerData.marker.setMap(mapInstance.current);

    // 드래그 이벤트 등록 (경로 생성 전에만)
    if (!isRouteGenerated) {
      window.kakao.maps.event.addListener(markerData.marker, 'dragend', () => {
        const newPosition = markerData.marker.getPosition();
        markerData.position = { lat: newPosition.getLat(), lng: newPosition.getLng() };

        if (onMarkersChange) {
          const positions = markersRef.current.map(m => m.position);
          onMarkersChange(positions);
        }
      });
    }

    markersRef.current.push(markerData);

    // 기존 마커들의 스타일 업데이트 (마지막 마커가 바뀔 수 있음)
    updateAllMarkerStyles();

    if (onMarkersChange) {
      const positions = markersRef.current.map(m => m.position);
      onMarkersChange(positions);
    }
  };

  const clearAllMarkers = () => {
    markersRef.current.forEach(markerData => {
      markerData.marker.setMap(null);
    });
    markersRef.current = [];

    if (onMarkersChange) {
      onMarkersChange([]);
    }
  };

  const removeLastMarker = () => {
    if (markersRef.current.length === 0) return;

    const lastMarker = markersRef.current[markersRef.current.length - 1];
    lastMarker.marker.setMap(null);
    markersRef.current = markersRef.current.slice(0, -1);

    // 나머지 마커들의 스타일 업데이트
    updateAllMarkerStyles();

    if (onMarkersChange) {
      const positions = markersRef.current.map(m => m.position);
      onMarkersChange(positions);
    }
  };

  const updateAllMarkerStyles = () => {
    if (!mapInstance.current) return;

    markersRef.current.forEach((markerData, index) => {
      const isFirstMarker = index === 0;
      const isLastMarker = index === markersRef.current.length - 1;
      const totalMarkers = markersRef.current.length;
      const isDestination = totalMarkers >= 2 && isLastMarker;

      let markerContent;
      if (isFirstMarker) {
        markerContent = ReactDOMServer.renderToString(<CustomMarker label={t('courseCreation.marker.start')} isSelected={true} fontSize={11} />);
      } else {
        markerContent = ReactDOMServer.renderToString(<CircleMarker number={index} isDestination={isDestination} />);
      }

      const markerSize = isFirstMarker ? new window.kakao.maps.Size(26, 32) : new window.kakao.maps.Size(22, 22);
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${markerSize.width}" height="${markerSize.height}" viewBox="0 0 ${markerSize.width} ${markerSize.height}">${markerContent}</svg>`;
      const encodedSvg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

      const markerImage = new window.kakao.maps.MarkerImage(encodedSvg, markerSize, {
        offset: isFirstMarker ? new window.kakao.maps.Point(13, 32) : new window.kakao.maps.Point(11, 11),
      });

      markerData.marker.setImage(markerImage);
    });
  };

  const addMarkerAt = (lat: number, lng: number) => {
    if (!mapInstance.current || isRouteGeneratedRef.current) return;

    const position = new window.kakao.maps.LatLng(lat, lng);
    addMarker(position);
  };

  const getMarkers = () => {
    return markersRef.current.map(m => m.position);
  };

  const moveMarkerTo = (index: number, lat: number, lng: number) => {
    if (index < 0 || index >= markersRef.current.length || !mapInstance.current) return;

    const markerData = markersRef.current[index];
    const newPosition = new window.kakao.maps.LatLng(lat, lng);

    // 카카오맵 마커 위치, 데이터 업데이트
    markerData.marker.setPosition(newPosition);
    markerData.position = { lat, lng };
  };

  const swapMarkers = (newMarkers: { lat: number; lng: number }[]) => {
    if (!mapInstance.current) return;

    // onMarkersChange 콜백 호출을 방지하기 위해 임시로 비활성화
    const originalOnMarkersChange = onMarkersChange;

    // 기존 마커들 제거 (콜백 없이)
    markersRef.current.forEach(markerData => {
      markerData.marker.setMap(null);
    });
    markersRef.current = [];

    // 새로운 순서로 마커들 다시 추가
    newMarkers.forEach((position, index) => {
      const latlng = new window.kakao.maps.LatLng(position.lat, position.lng);
      const markerData = createRouteMarker(latlng, index);
      markerData.marker.setMap(mapInstance.current);

      // 드래그 이벤트 등록 (경로 생성 전에만)
      if (!isRouteGenerated) {
        window.kakao.maps.event.addListener(markerData.marker, 'dragend', () => {
          const newPosition = markerData.marker.getPosition();
          markerData.position = { lat: newPosition.getLat(), lng: newPosition.getLng() };

          if (originalOnMarkersChange) {
            const positions = markersRef.current.map(m => m.position);
            originalOnMarkersChange(positions);
          }
        });
      }

      markersRef.current.push(markerData);
    });

    // 모든 마커 스타일 업데이트
    updateAllMarkerStyles();
  };

  const displayRoute = (coordinates: { lat: number; lng: number }[]) => {
    if (!mapInstance.current || coordinates.length < 2) return;

    // 기존 경로 제거
    clearRoute();

    // 좌표를 카카오맵 LatLng 객체로 변환
    const path = coordinates.map(coord => new window.kakao.maps.LatLng(coord.lat, coord.lng));

    // 폴리라인 생성
    const polyline = new window.kakao.maps.Polyline({
      path: path,
      strokeWeight: 6,
      strokeColor: '#4561FF',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    // 지도에 폴리라인 표시
    polyline.setMap(mapInstance.current);
    routePolylineRef.current = polyline;

    // 경로가 모두 보이도록 지도 영역 조정
    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach(latlng => bounds.extend(latlng));
    mapInstance.current.setBounds(bounds);
  };

  const clearRoute = () => {
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }
  };

  // 기존 마커들의 드래그 가능 여부 업데이트
  const updateMarkersDraggable = () => {
    markersRef.current.forEach(markerData => {
      markerData.marker.setDraggable(!isRouteGeneratedRef.current);
    });
  };

  useEffect(() => {
    if (!mapContainer.current || isMapInitialized.current) return;

    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;

    const onLoadKakaoMap = async () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(async () => {
          const container = mapContainer.current;
          if (!container || isMapInitialized.current) return;

          const initialLocation = await getInitialLocation();
          const isUserLocation = initialLocation !== BUSAN_CITY_HALL;

          const options = {
            center: new window.kakao.maps.LatLng(initialLocation.lat, initialLocation.lng),
            level: DEFAULT_MAP_LEVEL,
          };

          const map = new window.kakao.maps.Map(container, options);
          mapInstance.current = map;
          isMapInitialized.current = true;

          addLocationMarker(map, initialLocation, isUserLocation);

          // 지도 클릭 이벤트 등록
          const handleMapClick = (mouseEvent: kakao.maps.event.MouseEvent) => {
            if (!isRouteGeneratedRef.current) {
              // 경로 생성 전에만 마커 추가 가능
              const latlng = mouseEvent.latLng;
              addMarker(latlng);
            }
          };

          mapClickListenerRef.current = window.kakao.maps.event.addListener(map, 'click', handleMapClick);

          setIsMapLoaded(true);

          if (onMapLoad) {
            const mapInstanceWithMethods: RouteViewMapInstance = {
              moveToLocation: (lat: number, lng: number, level?: number) => {
                if (map) {
                  const position = new window.kakao.maps.LatLng(lat, lng);
                  if (level !== undefined) {
                    map.setLevel(level);
                  }
                  map.panTo(position);
                }
              },
              clearAllMarkers,
              removeLastMarker,
              addMarkerAt,
              moveMarkerTo,
              swapMarkers,
              getMarkers,
              displayRoute,
              clearRoute,
            };
            onMapLoad(mapInstanceWithMethods);
          }
        });
      }
    };

    const onErrorKakaoMap = (error: Event) => {
      console.error('Failed to load Kakao map script:', error);
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

      clearAllMarkers();
      clearRoute();

      // 지도 클릭 이벤트 제거
      if (mapClickListenerRef.current) {
        window.kakao.maps.event.removeListener(mapClickListenerRef.current);
      }

      isMapInitialized.current = false;
    };
  }, []);

  // isRouteGenerated 상태가 변경될 때마다 지도 클릭 이벤트 재등록 및 마커 업데이트
  useEffect(() => {
    if (!mapInstance.current) return;

    // 기존 마커들의 드래그 가능 여부 업데이트
    updateMarkersDraggable();

    // 지도 클릭 이벤트 재등록
    if (mapClickListenerRef.current) {
      // 기존 이벤트 제거
      window.kakao.maps.event.removeListener(mapClickListenerRef.current);

      // 새로운 이벤트 등록
      const handleMapClick = (mouseEvent: kakao.maps.event.MouseEvent) => {
        console.log('🖱️ 지도 클릭:', { isRouteGenerated: isRouteGeneratedRef.current });
        if (!isRouteGeneratedRef.current) {
          const latlng = mouseEvent.latLng;
          addMarker(latlng);
        }
      };

      mapClickListenerRef.current = window.kakao.maps.event.addListener(mapInstance.current, 'click', handleMapClick);
    }
  }, [isRouteGenerated]);

  return (
    <MapWrapper>
      {!isMapLoaded && (
        <LoadingOverlay>
          <Lottie animationData={LoadingMotion} style={{ width: 100, height: 100 }} loop={true} />
          <LoadingText>{t('courseDetail.loadingMap')}</LoadingText>
        </LoadingOverlay>
      )}
      <MapContainer ref={mapContainer} />
    </MapWrapper>
  );
};

export default RouteView;

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-surface-highlight, #f4f4f4);
  z-index: 1;
`;

const LoadingText = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
`;

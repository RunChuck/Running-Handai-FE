import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import Lottie from 'lottie-react';
import { BUSAN_CITY_HALL, DEFAULT_MAP_LEVEL } from '@/constants/locations';
import { getUserLocation, type LocationCoords } from '@/utils/geolocation';
import LoadingMotion from '@/assets/animations/run-loading.json';

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
  getMarkers: () => { lat: number; lng: number }[];
}

interface RouteViewProps {
  onMapLoad?: (map: RouteViewMapInstance) => void;
  onMarkersChange?: (markers: { lat: number; lng: number }[]) => void;
}

const RouteView = ({ onMapLoad, onMarkersChange }: RouteViewProps) => {
  const [t] = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<MarkerData[]>([]);
  const isMapInitialized = useRef(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const getInitialLocation = async (): Promise<LocationCoords> => {
    try {
      return await getUserLocation();
    } catch {
      console.log('부산 시청 좌표 사용:', BUSAN_CITY_HALL);
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

  const createRouteMarker = (position: kakao.maps.LatLng): MarkerData => {
    const marker = new window.kakao.maps.Marker({
      position: position,
      draggable: true,
    });

    const markerId = `marker_${Date.now()}_${Math.random()}`;
    const markerData: MarkerData = {
      id: markerId,
      position: { lat: position.getLat(), lng: position.getLng() },
      marker: marker,
    };

    window.kakao.maps.event.addListener(marker, 'dragend', () => {
      const newPosition = marker.getPosition();
      markerData.position = { lat: newPosition.getLat(), lng: newPosition.getLng() };

      if (onMarkersChange) {
        const positions = markersRef.current.map(m => m.position);
        onMarkersChange(positions);
      }
    });

    return markerData;
  };

  const addMarker = (position: kakao.maps.LatLng) => {
    if (!mapInstance.current) return;

    const markerData = createRouteMarker(position);
    markerData.marker.setMap(mapInstance.current);
    markersRef.current.push(markerData);

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

    if (onMarkersChange) {
      const positions = markersRef.current.map(m => m.position);
      onMarkersChange(positions);
    }
  };

  const addMarkerAt = (lat: number, lng: number) => {
    if (!mapInstance.current) return;

    const position = new window.kakao.maps.LatLng(lat, lng);
    addMarker(position);
  };

  const getMarkers = () => {
    return markersRef.current.map(m => m.position);
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

          window.kakao.maps.event.addListener(map, 'click', (mouseEvent: kakao.maps.event.MouseEvent) => {
            const latlng = mouseEvent.latLng;
            addMarker(latlng);
          });

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
              getMarkers,
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
      isMapInitialized.current = false;
    };
  }, []);

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

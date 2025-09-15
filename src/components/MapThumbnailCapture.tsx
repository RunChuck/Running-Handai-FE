import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styled from '@emotion/styled';
import { BUSAN_CITY_HALL } from '@/constants/locations';
import { fetchImageProxy } from '@/api/create';

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
    generateStaticMap: () => generateStaticMapImage(),
  }));

  const generateStaticMapImage = async (): Promise<Blob | null> => {
    return new Promise(resolve => {
      if (!mapInstance.current) {
        console.error('맵 인스턴스가 없음');
        resolve(null);
        return;
      }

      try {
        const center = mapInstance.current.getCenter();
        const level = mapInstance.current.getLevel();

        console.log('=== StaticMap 생성 시작 ===');
        console.log('지도 설정:', { lat: center.getLat(), lng: center.getLng(), level });
        console.log('경로 개수:', coordinates.length);

        // StaticMap을 위한 임시 컨테이너 생성
        const staticMapContainer = document.createElement('div');
        staticMapContainer.style.width = '311px';
        staticMapContainer.style.height = '311px';
        staticMapContainer.style.position = 'absolute';
        staticMapContainer.style.top = '-9999px';
        staticMapContainer.style.left = '-9999px';
        document.body.appendChild(staticMapContainer);

        // StaticMap 생성 옵션
        const staticMapOption = {
          center: new window.kakao.maps.LatLng(center.getLat(), center.getLng()),
          level: level,
          marker: false,
        };

        // StaticMap 생성 (사용은 안하는데 인스턴스 생성해야해서 있어야함)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _staticMap = new window.kakao.maps.StaticMap(staticMapContainer, staticMapOption);

        console.log('StaticMap 객체 생성 완료');

        // StaticMap 렌더링 완료를 위해 잠시 대기
        setTimeout(async () => {
          try {
            // StaticMap에서 생성된 이미지 찾기
            const imgElements = staticMapContainer.querySelectorAll('img');
            console.log('=== StaticMap 이미지 분석 ===');
            console.log('이미지 개수:', imgElements.length);

            imgElements.forEach((img, index) => {
              console.log(`이미지 ${index + 1}:`, img.src);
              console.log('크기:', img.width, 'x', img.height);
            });

            if (imgElements.length > 0) {
              // 첫 번째 이미지의 URL을 사용해서 Blob으로 변환
              const firstImg = imgElements[0];
              console.log('사용할 이미지 URL:', firstImg.src);

              // 프록시 API를 통해 이미지 URL을 Blob으로 변환
              console.log('프록시 API를 통해 이미지 가져오는 중:', firstImg.src);
              const blob = await fetchImageProxy(firstImg.src);

              // 임시 컨테이너 정리
              document.body.removeChild(staticMapContainer);

              console.log('StaticMap 이미지 생성 성공 (직접 추출)');
              console.log('이미지 크기:', blob.size, 'bytes');
              console.log('이미지 타입:', blob.type);
              resolve(blob);
            } else {
              console.error('StaticMap에서 이미지를 찾을 수 없음');
              document.body.removeChild(staticMapContainer);
              resolve(null);
            }
          } catch (error) {
            console.error('StaticMap 이미지 추출 실패:', error);
            document.body.removeChild(staticMapContainer);
            resolve(null);
          }
        }, 1000); // 1초 대기
      } catch (error) {
        console.error('StaticMap 생성 실패:', error);
        resolve(null);
      }
    });
  };

  const displayRoute = (routeCoordinates: { lat: number; lng: number }[]) => {
    if (!mapInstance.current || routeCoordinates.length < 2) return;

    // 기존 경로 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // 좌표를 카카오맵 LatLng 객체로 변환
    const path = routeCoordinates.map(coord => new window.kakao.maps.LatLng(coord.lat, coord.lng));

    // 폴리라인 생성
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

  return (
    <ThumbnailMapContainer>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </ThumbnailMapContainer>
  );
});

MapThumbnailCapture.displayName = 'MapThumbnailCapture';

export default MapThumbnailCapture;

const ThumbnailMapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

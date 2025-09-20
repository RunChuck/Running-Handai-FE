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
  generateStaticMap: () => Promise<Blob | null>;
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

  // 좌표를 픽셀 좌표로 변환하는 함수 (카카오맵 API 사용)
  const convertCoordToPixel = (coord: { lat: number; lng: number }, canvasSize: number) => {
    if (!mapInstance.current) return { x: 0, y: 0 };

    // 카카오맵의 좌표 변환 API 사용
    const projection = mapInstance.current.getProjection();
    const point = projection.containerPointFromCoords(new window.kakao.maps.LatLng(coord.lat, coord.lng));

    // 311px 지도에서의 픽셀 좌표를 622px 캔버스로 스케일링
    const scale = canvasSize / 311;

    return {
      x: point.x * scale,
      y: point.y * scale,
    };
  };

  // 캔버스에 폴리라인 그리기
  const drawPolylineOnCanvas = (ctx: CanvasRenderingContext2D, coordinates: { lat: number; lng: number }[], canvasSize: number) => {
    if (coordinates.length < 2) return;

    ctx.strokeStyle = '#4561FF';
    ctx.lineWidth = 8; // 고해상도용 굵은 선
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.9; // 조금 더 진하게

    ctx.beginPath();

    // 첫 번째 좌표로 이동
    const firstPixel = convertCoordToPixel(coordinates[0], canvasSize);
    ctx.moveTo(firstPixel.x, firstPixel.y);

    // 나머지 좌표들로 선 그리기
    for (let i = 1; i < coordinates.length; i++) {
      const pixel = convertCoordToPixel(coordinates[i], canvasSize);

      ctx.lineTo(pixel.x, pixel.y);
    }

    ctx.stroke();
    ctx.globalAlpha = 1.0; // 투명도 원복
  };

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

        // StaticMap 렌더링 완료를 위해 잠시 대기
        setTimeout(async () => {
          try {
            // StaticMap에서 생성된 이미지 찾기
            const imgElements = staticMapContainer.querySelectorAll('img');

            if (imgElements.length > 0) {
              // 첫 번째 이미지의 URL을 사용해서 Blob으로 변환
              const firstImg = imgElements[0];

              if (import.meta.env.DEV) {
                console.log('사용할 이미지 URL:', firstImg.src);
              }

              // 프록시 API를 통해 이미지 URL을 Blob으로 변환
              const mapImageBlob = await fetchImageProxy(firstImg.src);

              // 이미지를 Canvas에 로드하여 폴리라인과 합성
              const img = new Image();
              img.crossOrigin = 'anonymous';

              img.onload = () => {
                // 622x622 고해상도 캔버스 생성 (311 * 2)
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                  resolve(null);
                  return;
                }

                canvas.width = 622;
                canvas.height = 622;

                // 지도 이미지 그리기 (2배 크기로 확대)
                ctx.drawImage(img, 0, 0, 622, 622);

                // 폴리라인 그리기 (경로가 있는 경우에만)
                if (coordinates.length > 1) {
                  drawPolylineOnCanvas(ctx, coordinates, 622);
                }

                // 합성된 이미지를 Blob으로 변환
                canvas.toBlob(blob => {
                  // 임시 컨테이너 정리
                  document.body.removeChild(staticMapContainer);

                  if (blob) {
                    resolve(blob);
                  } else {
                    console.error('Canvas to Blob 변환 실패');
                    resolve(null);
                  }
                }, 'image/png');
              };

              img.onerror = () => {
                console.error('이미지 로드 실패');
                document.body.removeChild(staticMapContainer);
                resolve(null);
              };

              // Blob을 이미지로 로드
              img.src = URL.createObjectURL(mapImageBlob);
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

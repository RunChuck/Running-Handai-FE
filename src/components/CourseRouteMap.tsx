import { useEffect, useRef, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { CourseDetailData } from '@/types/course';
import type { MyCourseDetail } from '@/types/create';
import { convertTrackPointsToRoute, drawRouteOnMap, fitMapToBounds } from '@/utils/trackPointUtils';
import LoadingMotion from '@/assets/animations/run-loading.json';

interface CourseRouteMapProps {
  courseDetail: CourseDetailData | MyCourseDetail;
}

const CourseRouteMap = memo(
  ({ courseDetail }: CourseRouteMapProps) => {
    const [t] = useTranslation();
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<kakao.maps.Map | null>(null);
    const polyline = useRef<kakao.maps.Polyline | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
      if (!mapContainer.current) return;

      const mapScript = document.createElement('script');
      mapScript.async = true;
      mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;

      const onLoadKakaoMap = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            const container = mapContainer.current;
            if (!container) return;

            // 코스 데이터 변환
            const route = convertTrackPointsToRoute(courseDetail);

            const options = {
              center: new window.kakao.maps.LatLng(route.center.lat, route.center.lng),
              level: 5,
            };

            const map = new window.kakao.maps.Map(container, options);
            mapInstance.current = map;

            // 경로 그리기
            if (route.points.length > 0) {
              polyline.current = drawRouteOnMap(map, route);

              // 경로 조정 후 로딩 완료
              setTimeout(() => {
                fitMapToBounds(map, route);
                setTimeout(() => {
                  setIsMapLoaded(true);
                }, 100);
              }, 100);
            } else {
              setIsMapLoaded(true);
            }

            if (import.meta.env.DEV) {
              console.log('코스 경로 지도 초기화 완료:', route);
            }
          });
        }
      };

      const onErrorKakaoMap = (error: Event) => {
        console.error('코스 경로 지도 로드 실패:', error);
        setIsMapLoaded(true); // 에러 시에도 로딩 종료
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

        // 폴리라인 정리
        if (polyline.current) {
          polyline.current.setMap(null);
        }
      };
    }, [courseDetail.trackPoints]); // trackPoints만 의존성으로 사용

    return (
      <MapContainer>
        {!isMapLoaded && (
          <LoadingOverlay>
            <Lottie animationData={LoadingMotion} style={{ width: 100, height: 100 }} loop={true} />
            <LoadingText>{t('courseDetail.loadingMap')}</LoadingText>
          </LoadingOverlay>
        )}
        <MapDiv ref={mapContainer} isLoaded={isMapLoaded} />
        {'bookmarks' in courseDetail && (
          <BookmarkLabel>
            {courseDetail.bookmarks}
            {t('main.bookmark')}
          </BookmarkLabel>
        )}
      </MapContainer>
    );
  },
  (prevProps, nextProps) => {
    const trackPointsEqual = prevProps.courseDetail.trackPoints === nextProps.courseDetail.trackPoints;

    if ('bookmarks' in prevProps.courseDetail && 'bookmarks' in nextProps.courseDetail) {
      return trackPointsEqual && prevProps.courseDetail.bookmarks === nextProps.courseDetail.bookmarks;
    }

    return trackPointsEqual;
  }
);

CourseRouteMap.displayName = 'CourseRouteMap';

export default CourseRouteMap;

const MapContainer = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* 1:1 비율을 위한 패딩 트릭 */
  position: relative;
  background-color: var(--surface-surface-highlight, #f4f4f4);
`;

const MapDiv = styled.div<{ isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => (props.isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease;
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

const BookmarkLabel = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--Text-title, #1c1c1c);
  ${theme.typography.body2}
  z-index: 1;
`;

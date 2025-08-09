import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './Course.styled';

import { useDebounce } from '@/hooks/useDebounce';
import { useCourses } from '@/hooks/useCourses';
import { useBookmark } from '@/hooks/useBookmark';
import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';
import { useMap } from '@/contexts/MapContext';
import type { AreaCode, ThemeCode, CourseData } from '@/types/course';

import MapView from '@/components/MapView';
import FloatButton from '@/components/FloatButton';
import CourseModal from './components/CourseModal';
import BottomSheet from '@/components/BottomSheet';
import CourseList from './components/CourseList';
import CommonModal from '@/components/CommonModal';
import MetaTags from '@/components/MetaTags';
import LocationIconSrc from '@/assets/icons/location-icon.svg';
import ArrowUprightIconSrc from '@/assets/icons/arrow-upright.svg';
import MenuIconSrc from '@/assets/icons/menu-24px.svg';

const Course = () => {
  const [t] = useTranslation();
  const { mapRef } = useMap();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const {
    courses,
    loading,
    error,
    selectedFilter,
    selectedCourseId,
    lastMapViewport,
    fetchNearbyCourses,
    fetchCoursesByArea,
    fetchCoursesByTheme,
    handleCourseMarkerClick,
    updateCourseBookmark,
    setLastMapViewport,
  } = useCourses();
  const { handleBookmark } = useBookmark({
    onUpdateCourse: (courseId, updates) => {
      updateCourseBookmark(courseId, updates);
    },
    onUnauthenticated: () => {
      setIsLoginModalOpen(true);
    },
  });

  // A코스 시작점으로 지도 이동
  const moveToFirstCourseStart = useCallback(
    (fetchedCourses: CourseData[]) => {
      if (
        fetchedCourses &&
        fetchedCourses.length > 0 &&
        fetchedCourses[0].trackPoints &&
        fetchedCourses[0].trackPoints.length > 0 &&
        mapRef.current
      ) {
        const firstTrackPoint = fetchedCourses[0].trackPoints[0];
        const center = { lat: firstTrackPoint.lat, lng: firstTrackPoint.lon };
        const zoom = 7;

        mapRef.current.moveToLocation(center.lat, center.lng, zoom);

        // 뷰포트 저장
        setLastMapViewport({ center, zoom });
      }
    },
    [mapRef, setLastMapViewport]
  );

  // 특정 코스의 시작점으로 지도 이동
  const moveToCourseStart = useCallback(
    (courseId: number) => {
      const course = courses.find(c => c.courseId === courseId);
      if (course && course.trackPoints && course.trackPoints.length > 0 && mapRef.current) {
        const firstTrackPoint = course.trackPoints[0];
        const center = { lat: firstTrackPoint.lat, lng: firstTrackPoint.lon };
        const zoom = 7;

        mapRef.current.moveToLocation(center.lat, center.lng, zoom);

        // 뷰포트 저장
        setLastMapViewport({ center, zoom });
      }
    },
    [courses, mapRef, setLastMapViewport]
  );

  const moveToCurrentLocationHandler = async () => {
    try {
      const location = await getUserLocation();

      if (mapRef.current) {
        mapRef.current.moveToLocation(location.lat, location.lng);
        console.log('현재 위치로 이동:', location);
      }
    } catch (error) {
      console.warn('현재 위치를 가져올 수 없습니다:', error);
      if (mapRef.current) {
        mapRef.current.moveToLocation(BUSAN_CITY_HALL.lat, BUSAN_CITY_HALL.lng);
      }
    }
  };

  const { debouncedCallback: moveToCurrentLocation } = useDebounce(moveToCurrentLocationHandler, 300);

  const handleRecommendCourseClick = () => {
    setIsModalOpen(true);
  };

  const handleMenuClick = () => {
    console.log('메뉴 버튼 클릭');
    // TODO: 메뉴 기능 구현
  };

  const handleBookmarkClick = (course: CourseData) => {
    handleBookmark(course);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleAreaSelect = async (area: AreaCode) => {
    if (mapRef.current) {
      mapRef.current.clearAllCourses();
    }

    const fetchedCourses = await fetchCoursesByArea(area);
    moveToFirstCourseStart(fetchedCourses || []);
  };

  const handleThemeSelect = async (theme: ThemeCode) => {
    if (mapRef.current) {
      mapRef.current.clearAllCourses();
    }

    const fetchedCourses = await fetchCoursesByTheme(theme);
    moveToFirstCourseStart(fetchedCourses || []);
  };

  const handleCourseMarkerClickWrapper = (courseId: number) => {
    handleCourseMarkerClick(courseId);
    if (mapRef.current) {
      mapRef.current.updateSelectedCourse(courseId);
    }
    // 클릭한 코스의 시작점으로 지도 이동
    moveToCourseStart(courseId);
  };

  const handleBottomSheetHeightChange = (height: number) => {
    setBottomSheetHeight(height);
  };

  const getBottomSheetTitle = () => {
    if (selectedFilter.type === 'area' && selectedFilter.value) {
      return {
        prefix: t(`location.${selectedFilter.value.toLowerCase()}`),
        suffix: t('recommendedCourses'),
        isFiltered: true,
      };
    }

    if (selectedFilter.type === 'theme' && selectedFilter.value) {
      return {
        prefix: t(`theme.${selectedFilter.value.toLowerCase()}`),
        suffix: t('recommendedCourses'),
        isFiltered: true,
      };
    }

    return {
      prefix: '',
      suffix: t('recommendedCourses'),
      isFiltered: false,
    };
  };

  const handleMapLoad = () => {
    setIsMapInitialized(true);
  };

  // 코스 데이터가 변경되면 지도에 표시
  useEffect(() => {
    if (!mapRef.current || !isMapInitialized) return;

    if (selectedFilter.type === 'area' || selectedFilter.type === 'theme') {
      if (courses.length > 0) {
        try {
          mapRef.current.displayCourses(courses, selectedCourseId);

          // 선택된 코스가 있으면 해당 위치로, 없으면 첫 번째 코스로 이동
          if (selectedCourseId) {
            moveToCourseStart(selectedCourseId);
          } else {
            moveToFirstCourseStart(courses);
          }
        } catch (error) {
          console.warn('Failed to display courses:', error);
        }
      } else {
        try {
          mapRef.current.clearAllCourses();
        } catch (error) {
          console.warn('Failed to clear courses:', error);
        }
      }
    } else {
      // nearby인 경우 코스 제거
      try {
        mapRef.current.clearAllCourses();
      } catch (error) {
        console.warn('Failed to clear courses:', error);
      }
    }
  }, [courses, selectedFilter.type, selectedCourseId, isMapInitialized, mapRef, moveToCourseStart, moveToFirstCourseStart]);

  const floatButtons = (
    <>
      <FloatButton onClick={handleRecommendCourseClick} position={{ bottom: 0, center: true }} variant="pill">
        🏃‍♂️ {t('main.exploreCourses')}
        <img src={ArrowUprightIconSrc} alt={t('main.exploreCourses')} />
      </FloatButton>

      <FloatButton onClick={moveToCurrentLocation} position={{ bottom: 0, right: 16 }} variant="circular">
        <img src={LocationIconSrc} alt={t('currentLocation')} width={20} height={20} />
      </FloatButton>
    </>
  );

  return (
    <S.Container>
      <MetaTags />
      <S.MapContainer bottomSheetHeight={bottomSheetHeight}>
        <MapView
          ref={mapRef}
          onMapLoad={handleMapLoad}
          onCourseMarkerClick={handleCourseMarkerClickWrapper}
          containerHeight={window.innerHeight - bottomSheetHeight}
          initialCenter={lastMapViewport?.center}
          initialZoom={lastMapViewport?.zoom}
        />
      </S.MapContainer>

      <FloatButton onClick={handleMenuClick} position={{ top: 16, left: 16 }} size="large" variant="rounded">
        <img src={MenuIconSrc} alt={t('menu')} width={24} height={24} />
      </FloatButton>

      {!isModalOpen && (
        <BottomSheet titleData={getBottomSheetTitle()} floatButtons={floatButtons} onHeightChange={handleBottomSheetHeightChange}>
          <CourseList
            courses={courses}
            loading={loading}
            error={error}
            selectedCourseId={selectedCourseId}
            onBookmarkClick={handleBookmarkClick}
            onThemeSelect={handleThemeSelect}
            fetchNearbyCourses={fetchNearbyCourses}
            onCourseClick={handleCourseMarkerClick}
          />
        </BottomSheet>
      )}

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAreaSelect={handleAreaSelect}
        onThemeSelect={handleThemeSelect}
        selectedFilter={selectedFilter}
      />

      <CommonModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onConfirm={() => navigate('/')}
        content={t('main.loginMessage')}
        cancelText={t('cancel')}
        confirmText={t('main.simpleLogin')}
      />
    </S.Container>
  );
};

export default Course;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './Main.styled';

import { useDebounce } from '@/hooks/useDebounce';
import { useCourses } from '@/hooks/useCourses';
import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';
import { useMap } from '@/contexts/MapContext';
import type { AreaCode, ThemeCode } from '@/types/course';

import MapView from '@/components/MapView';
import FloatButton from '@/components/FloatButton';
import CourseModal from './components/CourseModal';
import BottomSheet from '@/components/BottomSheet';
import CourseList from './components/CourseList';
import CommonModal from '@/components/CommonModal';
import LocationIconSrc from '@/assets/icons/location-icon.svg';
import ArrowUprightIconSrc from '@/assets/icons/arrow-upright.svg';
import MenuIconSrc from '@/assets/icons/menu-24px.svg';

const Main = () => {
  const [t] = useTranslation();
  const { mapRef } = useMap();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<{
    type: 'nearby' | 'area' | 'theme';
    value?: AreaCode | ThemeCode;
  }>({ type: 'nearby' });
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();

  const { courses, loading, error, fetchNearbyCourses, fetchCoursesByArea, fetchCoursesByTheme } = useCourses();

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

  const handleBookmarkClick = () => {
    // TODO: 로그인 상태 확인 후 북마크 연결
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleAreaSelect = (area: AreaCode) => {
    setSelectedFilter({ type: 'area', value: area });
    setSelectedCourseId(undefined);
    if (mapRef.current) {
      mapRef.current.clearAllCourses();
    }
    fetchCoursesByArea(area);
  };

  const handleThemeSelect = (theme: ThemeCode) => {
    setSelectedFilter({ type: 'theme', value: theme });
    setSelectedCourseId(undefined);
    if (mapRef.current) {
      mapRef.current.clearAllCourses();
    }
    fetchCoursesByTheme(theme);
  };

  const handleCourseMarkerClick = (courseId: number) => {
    setSelectedCourseId(courseId);
    if (mapRef.current) {
      mapRef.current.updateSelectedCourse(courseId);
    }
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

  // 필터링된 경우에만 코스 표시
  useEffect(() => {
    if (courses.length > 0 && mapRef.current) {
      if (selectedFilter.type === 'area' || selectedFilter.type === 'theme') {
        const defaultSelectedId = selectedCourseId || courses[0]?.courseId;
        setSelectedCourseId(defaultSelectedId);

        mapRef.current.displayCourses(courses, defaultSelectedId);
      } else {
        // nearby인 경우 코스 제거
        mapRef.current.clearAllCourses();
        setSelectedCourseId(undefined);
      }
    }
  }, [courses, mapRef, selectedFilter.type]);

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
      <S.MapContainer bottomSheetHeight={bottomSheetHeight}>
        <MapView ref={mapRef} onCourseMarkerClick={handleCourseMarkerClick} containerHeight={window.innerHeight - bottomSheetHeight} />
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

export default Main;

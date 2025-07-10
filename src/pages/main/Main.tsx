import { useState } from 'react';
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
import CourseItem from './components/CourseItem';
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
  const [selectedFilter, setSelectedFilter] = useState<{
    type: 'nearby' | 'area' | 'theme';
    value?: AreaCode | ThemeCode;
  }>({ type: 'nearby' });

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
    fetchCoursesByArea(area);
  };

  const handleThemeSelect = (theme: ThemeCode) => {
    setSelectedFilter({ type: 'theme', value: theme });
    fetchCoursesByTheme(theme);
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

  const renderCourseList = () => {
    if (loading) {
      return (
        <S.StatusContainer>
          <S.StatusText>{t('main.loading')}</S.StatusText>
        </S.StatusContainer>
      );
    }

    if (error) {
      return (
        <S.ErrorContainer>
          <S.StatusText>{error}</S.StatusText>
          <S.RetryButton onClick={fetchNearbyCourses}>{t('retry')}</S.RetryButton>
        </S.ErrorContainer>
      );
    }

    if (courses.length === 0) {
      return (
        <S.StatusContainer>
          <S.StatusText>{t('main.noCourses')}</S.StatusText>
        </S.StatusContainer>
      );
    }

    return (
      <S.CourseGrid>
        {courses.map((course, index) => (
          <CourseItem key={course.courseId} course={course} index={index} onBookmarkClick={handleBookmarkClick} />
        ))}
      </S.CourseGrid>
    );
  };

  return (
    <S.Container>
      <MapView ref={mapRef} />

      <FloatButton onClick={handleMenuClick} position={{ top: 16, left: 16 }} size="large" variant="rounded">
        <img src={MenuIconSrc} alt={t('menu')} width={24} height={24} />
      </FloatButton>

      {!isModalOpen && (
        <BottomSheet titleData={getBottomSheetTitle()} floatButtons={floatButtons}>
          {renderCourseList()}
        </BottomSheet>
      )}

      <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAreaSelect={handleAreaSelect} onThemeSelect={handleThemeSelect} />

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

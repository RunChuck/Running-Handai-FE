import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './Main.styled';

import { useDebounce } from '@/hooks/useDebounce';
import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';
import { useMap } from '@/contexts/MapContext';

import MapView from '@/components/MapView';
import FloatButton from '@/components/FloatButton';
import CourseModal from './components/CourseModal';
import BottomSheet from '@/components/BottomSheet';
import CourseItem, { type CourseData } from './components/CourseItem';
import CommonModal from '@/components/CommonModal';
import LocationIconSrc from '@/assets/icons/location-icon.svg';
import ArrowUprightIconSrc from '@/assets/icons/arrow-upright.svg';
import MenuIconSrc from '@/assets/icons/menu-24px.svg';
import TempThumbnailImgSrc from '@/assets/images/temp-thumbnail.png';

// mock data
const MOCK_COURSES: CourseData[] = [
  {
    id: 1,
    title: 'A코스',
    thumbnail: TempThumbnailImgSrc,
    bookmarkCount: 125,
    distance: '4km',
    duration: '4시간 44분',
    elevation: '44m',
    isBookmarked: true,
  },
  {
    id: 2,
    title: 'B코스',
    thumbnail: TempThumbnailImgSrc,
    bookmarkCount: 89,
    distance: '2.5km',
    duration: '2시간 15분',
    elevation: '32m',
    isBookmarked: false,
  },
  {
    id: 3,
    title: 'C코스',
    thumbnail: TempThumbnailImgSrc,
    bookmarkCount: 203,
    distance: '6.2km',
    duration: '5시간 30분',
    elevation: '128m',
    isBookmarked: true,
  },
  {
    id: 4,
    title: 'D코스',
    thumbnail: TempThumbnailImgSrc,
    bookmarkCount: 67,
    distance: '3.8km',
    duration: '3시간 20분',
    elevation: '56m',
    isBookmarked: false,
  },
  {
    id: 5,
    title: 'E코스',
    thumbnail: TempThumbnailImgSrc,
    bookmarkCount: 156,
    distance: '5.1km',
    duration: '4시간 50분',
    elevation: '89m',
    isBookmarked: false,
  },
  {
    id: 6,
    title: 'F코스',
    thumbnail: TempThumbnailImgSrc,
    bookmarkCount: 92,
    distance: '7.3km',
    duration: '6시간 10분',
    elevation: '145m',
    isBookmarked: false,
  },
];

const Main = () => {
  const { mapRef } = useMap();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

  const floatButtons = (
    <>
      <FloatButton onClick={handleRecommendCourseClick} position={{ bottom: 0, center: true }} variant="pill">
        🏃‍♂️ 추천 코스 탐색
        <img src={ArrowUprightIconSrc} alt="추천 코스 탐색" />
      </FloatButton>

      <FloatButton onClick={moveToCurrentLocation} position={{ bottom: 0, right: 16 }} variant="circular">
        <img src={LocationIconSrc} alt="현재 위치" width={20} height={20} />
      </FloatButton>
    </>
  );

  return (
    <S.Container>
      <MapView ref={mapRef} />

      <FloatButton onClick={handleMenuClick} position={{ top: 16, left: 16 }} size="large" variant="rounded">
        <img src={MenuIconSrc} alt="메뉴" width={24} height={24} />
      </FloatButton>

      {!isModalOpen && (
        <BottomSheet floatButtons={floatButtons}>
          <S.CourseGrid>
            {MOCK_COURSES.map(course => (
              <CourseItem key={course.id} course={course} onBookmarkClick={handleBookmarkClick} />
            ))}
          </S.CourseGrid>
        </BottomSheet>
      )}

      <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <CommonModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onConfirm={() => navigate('/')}
        content={`로그인하고\n마음에 드는 코스를 저장해보세요!`}
        cancelText="취소"
        confirmText="간편 로그인 하기"
      />
    </S.Container>
  );
};

export default Main;

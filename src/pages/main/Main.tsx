import { useState } from 'react';
import * as S from './Main.styled';

import { useDebounce } from '@/hooks/useDebounce';
import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';
import { useMap } from '@/contexts/MapContext';

import MapView from '@/components/MapView';
import FloatButton from '@/components/FloatButton';
import CourseModal from './components/CourseModal';
import BottomSheet from '@/components/BottomSheet';
import LocationIconSrc from '@/assets/icons/location-icon.svg';
import ArrowUprightIconSrc from '@/assets/icons/arrow-upright.svg';
import MenuIconSrc from '@/assets/icons/menu-24px.svg';

const Main = () => {
  const { mapRef } = useMap();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      <BottomSheet floatButtons={floatButtons}>
        {/* TODO: 코스 리스트 컴포넌트 추가 */}
        여기에 코스 리스트
      </BottomSheet>

      <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </S.Container>
  );
};

export default Main;

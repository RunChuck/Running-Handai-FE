import { useRef } from 'react';
import * as S from './Main.styled';

import { useDebounce } from '@/hooks/useDebounce';
import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';

import MapView from '@/components/MapView';
import type { MapViewRef } from '@/components/MapView';
import FloatButton from '@/components/FloatButton';
import LocationIconSrc from '@/assets/icons/location-icon.svg';
import ArrowUprightIconSrc from '@/assets/icons/arrow-upright.svg';
import MenuIconSrc from '@/assets/icons/menu-24px.svg';

const Main = () => {
  const mapRef = useRef<MapViewRef>(null);

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
    // TODO: 추천 코스 탐색
  };

  const handleMenuClick = () => {
    console.log('메뉴 버튼 클릭');
    // TODO: 메뉴 기능 구현
  };

  return (
    <S.Container>
      <MapView ref={mapRef} />

      <FloatButton onClick={handleMenuClick} position={{ top: 16, left: 16 }} size="medium" variant="rounded">
        <img src={MenuIconSrc} alt="메뉴" />
      </FloatButton>

      <FloatButton onClick={handleRecommendCourseClick} position={{ bottom: 16, center: true }} variant="pill">
        🏃‍♂️ 추천 코스 탐색
        <img src={ArrowUprightIconSrc} alt="추천 코스 탐색" />
      </FloatButton>

      <FloatButton onClick={moveToCurrentLocation} position={{ bottom: 16, right: 16 }} size="small" variant="circular">
        <img src={LocationIconSrc} alt="현재 위치" />
      </FloatButton>
    </S.Container>
  );
};

export default Main;

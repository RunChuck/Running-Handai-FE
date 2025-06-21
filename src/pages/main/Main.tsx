import { useRef } from 'react';
import * as S from './Main.styled';

import { useDebounce } from '@/hooks/useDebounce';
import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';

import MapView from '@/components/MapView';
import type { MapViewRef } from '@/components/MapView';
import LocationIconSrc from '@/assets/icons/location-icon.svg';

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

  return (
    <S.Container>
      <MapView ref={mapRef} />
      <S.CurrentLocationButton onClick={moveToCurrentLocation}>
        <img src={LocationIconSrc} alt="현재 위치" />
      </S.CurrentLocationButton>
    </S.Container>
  );
};

export default Main;

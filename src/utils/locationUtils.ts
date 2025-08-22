import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';
import { useDebounce } from '@/hooks/useDebounce';

export interface MapInstance {
  moveToLocation: (lat: number, lng: number, level?: number) => void;
}

export const moveToCurrentLocation = async (mapInstance: MapInstance | null) => {
  if (!mapInstance) {
    console.warn('Map instance is not available');
    return;
  }

  try {
    const location = await getUserLocation();
    mapInstance.moveToLocation(location.lat, location.lng);

    if (import.meta.env.DEV) {
      console.log('현재 위치로 이동:', location);
    }

    return location;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('현재 위치를 가져올 수 없습니다:', error);
    }

    mapInstance.moveToLocation(BUSAN_CITY_HALL.lat, BUSAN_CITY_HALL.lng);
    return BUSAN_CITY_HALL;
  }
};

export const useDebouncedCurrentLocation = (mapInstance: MapInstance | null, delay = 300) => {
  const moveToCurrentLocationHandler = () => moveToCurrentLocation(mapInstance);
  const { debouncedCallback } = useDebounce(moveToCurrentLocationHandler, delay);
  return debouncedCallback;
};

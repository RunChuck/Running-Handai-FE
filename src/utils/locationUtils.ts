import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';
import { useDebounce } from '@/hooks/useDebounce';

export interface MapInstance {
  moveToLocation: (lat: number, lng: number, level?: number) => void;
  getCurrentLevel?: () => number;
  updateCurrentLocationMarker?: () => Promise<void>;
}

export const moveToCurrentLocation = async (mapInstance: MapInstance | null) => {
  if (!mapInstance) {
    console.warn('Map instance is not available');
    return;
  }

  try {
    // 현재 위치 가져오기 (캐시 사용 X)
    const location = await getUserLocation({ maximumAge: 0 });

    // 현재 줌 레벨 확인 후 조건부 레벨 설정
    const currentLevel = mapInstance.getCurrentLevel?.() ?? 7;
    const targetLevel = currentLevel > 7 ? 7 : undefined;

    mapInstance.moveToLocation(location.lat, location.lng, targetLevel);

    if (mapInstance.updateCurrentLocationMarker) {
      await mapInstance.updateCurrentLocationMarker();
    }

    if (import.meta.env.DEV) {
      console.log('현재 위치로 이동:', location);
    }

    return location;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('현재 위치를 가져올 수 없습니다:', error);
    }

    const currentLevel = mapInstance.getCurrentLevel?.() ?? 7;
    const targetLevel = currentLevel > 7 ? 7 : undefined;

    mapInstance.moveToLocation(BUSAN_CITY_HALL.lat, BUSAN_CITY_HALL.lng, targetLevel);
    return BUSAN_CITY_HALL;
  }
};

export const useDebouncedCurrentLocation = (mapInstance: MapInstance | null, delay = 300) => {
  const moveToCurrentLocationHandler = () => moveToCurrentLocation(mapInstance);
  const { debouncedCallback } = useDebounce(moveToCurrentLocationHandler, delay);
  return debouncedCallback;
};

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { courseAPI } from '@/api/course';
import { courseKeys } from '@/constants/queryKeys';
import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';
import type { CourseData, CourseResponse, AreaCode, ThemeCode } from '@/types/course';

export const useCourses = () => {
  const queryClient = useQueryClient();
  const [currentFilter, setCurrentFilter] = useState<{
    type: 'nearby' | 'area' | 'theme';
    value?: AreaCode | ThemeCode;
    location?: { lat: number; lng: number };
  }>({ type: 'nearby' });

  const getCurrentLocation = useCallback(async () => {
    try {
      return await getUserLocation();
    } catch {
      console.log('위치 권한 없음. 부산 시청 좌표 사용');
      return BUSAN_CITY_HALL;
    }
  }, []);

  // 현재 필터에 맞는 쿼리 키와 함수 설정
  const getQueryConfig = useCallback(() => {
    if (!currentFilter.location) return null;

    const { lat, lng } = currentFilter.location;

    switch (currentFilter.type) {
      case 'nearby':
        return {
          queryKey: courseKeys.nearby(lat, lng),
          queryFn: async (): Promise<CourseResponse> => courseAPI.getCourses({ filter: 'NEARBY', lat, lon: lng }),
        };
      case 'area':
        return {
          queryKey: courseKeys.area(currentFilter.value as AreaCode, lat, lng),
          queryFn: async (): Promise<CourseResponse> =>
            courseAPI.getCourses({
              filter: 'AREA',
              lat,
              lon: lng,
              area: currentFilter.value as AreaCode,
            }),
        };
      case 'theme':
        return {
          queryKey: courseKeys.theme(currentFilter.value as ThemeCode, lat, lng),
          queryFn: async (): Promise<CourseResponse> =>
            courseAPI.getCourses({
              filter: 'THEME',
              lat,
              lon: lng,
              theme: currentFilter.value as ThemeCode,
            }),
        };
      default:
        return null;
    }
  }, [currentFilter]);

  const queryConfig = getQueryConfig();

  // 초기 위치 설정을 위한 쿼리
  const { data: userLocation } = useQuery({
    queryKey: ['currentLocation'],
    queryFn: getCurrentLocation,
    staleTime: 3 * 60 * 1000, // 위치는 3분간만 캐시
    retry: 1,
  });

  const query = useQuery({
    queryKey: queryConfig?.queryKey ?? ['courses', 'empty'],
    queryFn: queryConfig?.queryFn ?? (() => Promise.resolve({ data: [] as CourseData[] })),
    enabled: !!queryConfig && !!userLocation,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 위치가 설정되면 현재 필터 업데이트
  useEffect(() => {
    if (userLocation) {
      setCurrentFilter(prev => ({
        ...prev,
        location: { lat: userLocation.lat, lng: userLocation.lng },
      }));
    }
  }, [userLocation]);

  const fetchNearbyCourses = useCallback(async () => {
    if (!userLocation) return;
    setCurrentFilter({ type: 'nearby', location: { lat: userLocation.lat, lng: userLocation.lng } });
  }, [userLocation]);

  const fetchCoursesByArea = useCallback(
    async (area: AreaCode): Promise<CourseData[] | undefined> => {
      if (!userLocation) return;

      const locationCoords = { lat: userLocation.lat, lng: userLocation.lng };
      setCurrentFilter({ type: 'area', value: area, location: locationCoords });

      // 캐시된 데이터가 있으면 즉시 반환
      const cachedData = queryClient.getQueryData(courseKeys.area(area, userLocation.lat, userLocation.lng));
      if (cachedData) {
        return (cachedData as CourseResponse).data;
      }

      try {
        const response = await courseAPI.getCourses({
          filter: 'AREA',
          lat: userLocation.lat,
          lon: userLocation.lng,
          area,
        });
        return response.data;
      } catch (error) {
        console.error('지역별 코스 조회 실패:', error);
        return undefined;
      }
    },
    [userLocation, queryClient]
  );

  const fetchCoursesByTheme = useCallback(
    async (theme: ThemeCode): Promise<CourseData[] | undefined> => {
      if (!userLocation) return;

      const locationCoords = { lat: userLocation.lat, lng: userLocation.lng };
      setCurrentFilter({ type: 'theme', value: theme, location: locationCoords });

      // 캐시된 데이터가 있으면 즉시 반환
      const cachedData = queryClient.getQueryData(courseKeys.theme(theme, userLocation.lat, userLocation.lng));
      if (cachedData) {
        return (cachedData as CourseResponse).data;
      }

      try {
        const response = await courseAPI.getCourses({
          filter: 'THEME',
          lat: userLocation.lat,
          lon: userLocation.lng,
          theme,
        });
        return response.data;
      } catch (error) {
        console.error('테마별 코스 조회 실패:', error);
        return undefined;
      }
    },
    [userLocation, queryClient]
  );

  const courses = useMemo(() => {
    return (query.data as CourseResponse)?.data || [];
  }, [query.data]);

  return {
    courses,
    loading: query.isLoading,
    error: query.error?.message || null,
    fetchNearbyCourses,
    fetchCoursesByArea,
    fetchCoursesByTheme,
  };
};

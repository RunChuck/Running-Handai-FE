import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { courseAPI } from '@/api/course';
import { courseKeys } from '@/constants/queryKeys';
import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';
import type { CourseData, CourseResponse, AreaCode, ThemeCode } from '@/types/course';

const STORAGE_KEY = 'courseFilterState';

export const useCourses = () => {
  const queryClient = useQueryClient();
  const [currentFilter, setCurrentFilter] = useState<{
    type: 'nearby' | 'area' | 'theme';
    value?: AreaCode | ThemeCode;
    location?: { lat: number; lng: number };
  }>({ type: 'nearby' });
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();

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

  // 위치가 설정되면 현재 필터 업데이트 및 세션스토리지 복원
  useEffect(() => {
    if (userLocation) {
      setCurrentFilter(prev => ({
        ...prev,
        location: { lat: userLocation.lat, lng: userLocation.lng },
      }));

      // 세션스토리지에서 필터와 코스 데이터 복원
      try {
        const savedState = sessionStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const { filter, selectedCourseId: savedSelectedId, courses: savedCourses } = JSON.parse(savedState);
          console.log('Restoring filter from useCourses:', filter);

          if (filter && filter.type !== 'nearby' && savedCourses && savedCourses.length > 0) {
            setSelectedCourseId(savedSelectedId);

            // 필터 설정과 동시에 캐시에 데이터 저장
            if (filter.type === 'area' && filter.value) {
              const queryKey = courseKeys.area(filter.value, userLocation.lat, userLocation.lng);
              queryClient.setQueryData(queryKey, { data: savedCourses });
              setCurrentFilter({
                type: 'area',
                value: filter.value,
                location: { lat: userLocation.lat, lng: userLocation.lng },
              });
            } else if (filter.type === 'theme' && filter.value) {
              const queryKey = courseKeys.theme(filter.value, userLocation.lat, userLocation.lng);
              queryClient.setQueryData(queryKey, { data: savedCourses });
              setCurrentFilter({
                type: 'theme',
                value: filter.value,
                location: { lat: userLocation.lat, lng: userLocation.lng },
              });
            }
          }
        }
      } catch (error) {
        console.warn('Failed to restore filter state:', error);
      }
    }
  }, [userLocation, queryClient]);

  const fetchNearbyCourses = useCallback(async () => {
    if (!userLocation) return;
    setCurrentFilter({ type: 'nearby', location: { lat: userLocation.lat, lng: userLocation.lng } });
  }, [userLocation]);

  const fetchCoursesByArea = useCallback(
    async (area: AreaCode): Promise<CourseData[] | undefined> => {
      if (!userLocation) return;

      const locationCoords = { lat: userLocation.lat, lng: userLocation.lng };
      const filter = { type: 'area' as const, value: area };

      setCurrentFilter({ ...filter, location: locationCoords });

      // 캐시된 데이터가 있으면 즉시 반환
      const cachedData = queryClient.getQueryData(courseKeys.area(area, userLocation.lat, userLocation.lng));
      if (cachedData) {
        const courses = (cachedData as CourseResponse).data;
        const firstCourseId = courses[0]?.courseId;
        setSelectedCourseId(firstCourseId);

        // 세션스토리지에 저장
        try {
          sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              filter,
              selectedCourseId: firstCourseId,
              courses,
            })
          );
        } catch (error) {
          console.warn('Failed to save filter state:', error);
        }

        return courses;
      }

      try {
        const response = await courseAPI.getCourses({
          filter: 'AREA',
          lat: userLocation.lat,
          lon: userLocation.lng,
          area,
        });

        const courses = response.data;
        const firstCourseId = courses[0]?.courseId;
        setSelectedCourseId(firstCourseId);

        // 세션스토리지에 저장
        try {
          sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              filter,
              selectedCourseId: firstCourseId,
              courses,
            })
          );
        } catch (error) {
          console.warn('Failed to save filter state:', error);
        }

        return courses;
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
      const filter = { type: 'theme' as const, value: theme };

      setCurrentFilter({ ...filter, location: locationCoords });

      // 캐시된 데이터가 있으면 즉시 반환
      const cachedData = queryClient.getQueryData(courseKeys.theme(theme, userLocation.lat, userLocation.lng));
      if (cachedData) {
        const courses = (cachedData as CourseResponse).data;
        const firstCourseId = courses[0]?.courseId;
        setSelectedCourseId(firstCourseId);

        // 세션스토리지에 저장
        try {
          sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              filter,
              selectedCourseId: firstCourseId,
              courses,
            })
          );
        } catch (error) {
          console.warn('Failed to save filter state:', error);
        }

        return courses;
      }

      try {
        const response = await courseAPI.getCourses({
          filter: 'THEME',
          lat: userLocation.lat,
          lon: userLocation.lng,
          theme,
        });

        const courses = response.data;
        const firstCourseId = courses[0]?.courseId;
        setSelectedCourseId(firstCourseId);

        // 세션스토리지에 저장
        try {
          sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              filter,
              selectedCourseId: firstCourseId,
              courses,
            })
          );
        } catch (error) {
          console.warn('Failed to save filter state:', error);
        }

        return courses;
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

  const handleCourseMarkerClick = useCallback((courseId: number) => {
    setSelectedCourseId(courseId);

    // 세션스토리지 업데이트 (선택된 코스 아이디만)
    try {
      const savedState = sessionStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...parsedState,
            selectedCourseId: courseId,
          })
        );
      }
    } catch (error) {
      console.warn('Failed to update selected course:', error);
    }
  }, []);

  const updateCourseBookmark = useCallback(
    (courseId: number, updates: { isBookmarked: boolean; bookmarks: number }) => {
      // React Query 캐시의 모든 코스 데이터 업데이트
      queryClient.setQueriesData({ queryKey: courseKeys.all }, (oldData: unknown) => {
        const data = oldData as CourseResponse | undefined;
        if (!data?.data) return data;

        return {
          ...data,
          data: data.data.map((course: CourseData) => (course.courseId === courseId ? { ...course, ...updates } : course)),
        };
      });

      // 세션스토리지 업데이트
      try {
        const savedState = sessionStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          if (parsedState.courses) {
            const updatedCourses = parsedState.courses.map((course: CourseData) =>
              course.courseId === courseId ? { ...course, ...updates } : course
            );
            sessionStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                ...parsedState,
                courses: updatedCourses,
              })
            );
          }
        }
      } catch (error) {
        console.warn('Failed to update bookmark in session storage:', error);
      }
    },
    [queryClient]
  );

  return {
    courses,
    loading: query.isLoading,
    error: query.error?.message || null,
    selectedFilter: currentFilter,
    selectedCourseId,
    fetchNearbyCourses,
    fetchCoursesByArea,
    fetchCoursesByTheme,
    handleCourseMarkerClick,
    updateCourseBookmark,
  };
};

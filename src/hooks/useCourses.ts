import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { courseAPI } from '@/api/course';
import { courseKeys } from '@/constants/queryKeys';
import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';
import { useCourseStore } from '@/stores/courseStore';
import type { CourseData, CourseResponse, AreaCode, ThemeCode } from '@/types/course';

export const useCourses = () => {
  const queryClient = useQueryClient();

  const { selectedFilter, selectedCourseId, setFilter, setSelectedCourse } = useCourseStore();

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getCurrentLocation = useCallback(async () => {
    try {
      return await getUserLocation();
    } catch {
      console.log('위치 권한 없음. 부산 시청 좌표 사용');
      return BUSAN_CITY_HALL;
    }
  }, []);

  // 초기 위치 설정
  useEffect(() => {
    getCurrentLocation().then(location => {
      setUserLocation(location);

      // 복원된 필터가 있으면 location 정보 추가
      if (selectedFilter.type !== 'nearby' && selectedFilter.value) {
        setFilter({
          ...selectedFilter,
          location: { lat: location.lat, lng: location.lng },
        });
      } else {
        setFilter({
          type: 'nearby',
          location: { lat: location.lat, lng: location.lng },
        });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 현재 필터에 맞는 쿼리 설정
  const getQueryConfig = useCallback(() => {
    if (!selectedFilter.location) return null;

    const { lat, lng } = selectedFilter.location;

    switch (selectedFilter.type) {
      case 'nearby':
        return {
          queryKey: courseKeys.nearby(lat, lng),
          queryFn: async (): Promise<CourseResponse> => courseAPI.getCourses({ filter: 'NEARBY', lat, lon: lng }),
        };
      case 'area':
        return {
          queryKey: courseKeys.area(selectedFilter.value as AreaCode, lat, lng),
          queryFn: async (): Promise<CourseResponse> =>
            courseAPI.getCourses({
              filter: 'AREA',
              lat,
              lon: lng,
              area: selectedFilter.value as AreaCode,
            }),
        };
      case 'theme':
        return {
          queryKey: courseKeys.theme(selectedFilter.value as ThemeCode, lat, lng),
          queryFn: async (): Promise<CourseResponse> =>
            courseAPI.getCourses({
              filter: 'THEME',
              lat,
              lon: lng,
              theme: selectedFilter.value as ThemeCode,
            }),
        };
      default:
        return null;
    }
  }, [selectedFilter]);

  const queryConfig = getQueryConfig();

  const query = useQuery({
    queryKey: queryConfig?.queryKey ?? ['courses', 'empty'],
    queryFn: queryConfig?.queryFn ?? (() => Promise.resolve({ data: [] as CourseData[] })),
    enabled: !!queryConfig && !!userLocation,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const courses = useMemo(() => {
    return (query.data as CourseResponse)?.data || [];
  }, [query.data]);

  // 근처 코스 조회
  const fetchNearbyCourses = useCallback(async () => {
    if (!userLocation) return;
    setFilter({
      type: 'nearby',
      location: { lat: userLocation.lat, lng: userLocation.lng },
    });
    setSelectedCourse(undefined);
  }, [userLocation, setFilter, setSelectedCourse]);

  // 지역별 코스 조회
  const fetchCoursesByArea = useCallback(
    async (area: AreaCode): Promise<CourseData[] | undefined> => {
      if (!userLocation) return;

      setFilter({
        type: 'area',
        value: area,
        location: { lat: userLocation.lat, lng: userLocation.lng },
      });

      // 첫 번째 코스를 선택된 상태로 설정
      const cachedData = queryClient.getQueryData(courseKeys.area(area, userLocation.lat, userLocation.lng));
      if (cachedData) {
        const courses = (cachedData as CourseResponse).data;
        const firstCourseId = courses[0]?.courseId;
        setSelectedCourse(firstCourseId);
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
        setSelectedCourse(firstCourseId);

        return courses;
      } catch (error) {
        console.error('지역별 코스 조회 실패:', error);
        return undefined;
      }
    },
    [userLocation, queryClient, setFilter, setSelectedCourse]
  );

  // 테마별 코스 조회
  const fetchCoursesByTheme = useCallback(
    async (theme: ThemeCode): Promise<CourseData[] | undefined> => {
      if (!userLocation) return;

      setFilter({
        type: 'theme',
        value: theme,
        location: { lat: userLocation.lat, lng: userLocation.lng },
      });

      // 첫 번째 코스를 선택된 상태로 설정
      const cachedData = queryClient.getQueryData(courseKeys.theme(theme, userLocation.lat, userLocation.lng));
      if (cachedData) {
        const courses = (cachedData as CourseResponse).data;
        const firstCourseId = courses[0]?.courseId;
        setSelectedCourse(firstCourseId);
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
        setSelectedCourse(firstCourseId);

        return courses;
      } catch (error) {
        console.error('테마별 코스 조회 실패:', error);
        return undefined;
      }
    },
    [userLocation, queryClient, setFilter, setSelectedCourse]
  );

  // 코스 마커 클릭 핸들러
  const handleCourseMarkerClick = useCallback(
    (courseId: number) => {
      setSelectedCourse(courseId);
    },
    [setSelectedCourse]
  );

  // 북마크 업데이트
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
    },
    [queryClient]
  );

  return {
    courses,
    loading: query.isLoading,
    error: query.error?.message || null,
    selectedFilter,
    selectedCourseId,
    fetchNearbyCourses,
    fetchCoursesByArea,
    fetchCoursesByTheme,
    handleCourseMarkerClick,
    updateCourseBookmark,
  };
};
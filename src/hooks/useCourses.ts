import { useState, useEffect } from 'react';
import { courseAPI } from '@/api/course';
import { getUserLocation } from '@/utils/geolocation';
import { BUSAN_CITY_HALL } from '@/constants/locations';
import type { CourseData, CourseRequest, AreaCode, ThemeCode } from '@/types/course';

export const useCourses = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async () => {
    try {
      return await getUserLocation();
    } catch {
      console.log('위치 권한 없음. 부산 시청 좌표 사용');
      return BUSAN_CITY_HALL;
    }
  };

  const fetchNearbyCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const location = await getCurrentLocation();
      const request: CourseRequest = {
        filter: 'NEARBY',
        lat: location.lat,
        lon: location.lng,
      };

      const response = await courseAPI.getCourses(request);
      setCourses(response.data);
    } catch (err) {
      setError('코스 목록을 불러오는데 실패했습니다.');
      console.error('코스 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesByArea = async (area: AreaCode) => {
    try {
      setLoading(true);
      setError(null);

      const location = await getCurrentLocation();
      const request: CourseRequest = {
        filter: 'AREA',
        lat: location.lat,
        lon: location.lng,
        area,
      };

      const response = await courseAPI.getCourses(request);
      setCourses(response.data);
    } catch (err) {
      setError('지역별 코스 조회에 실패했습니다.');
      console.error('지역별 코스 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesByTheme = async (theme: ThemeCode) => {
    try {
      setLoading(true);
      setError(null);

      const location = await getCurrentLocation();
      const request: CourseRequest = {
        filter: 'THEME',
        lat: location.lat,
        lon: location.lng,
        theme,
      };

      const response = await courseAPI.getCourses(request);
      setCourses(response.data);
    } catch (err) {
      setError('테마별 코스 조회에 실패했습니다.');
      console.error('테마별 코스 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트시 자동으로 내 주변 코스 조회
  useEffect(() => {
    fetchNearbyCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    fetchNearbyCourses,
    fetchCoursesByArea,
    fetchCoursesByTheme,
  };
};

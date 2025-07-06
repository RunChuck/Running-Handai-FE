import { useState, useEffect } from 'react';
import { courseAPI } from '@/api/course';
import type { CourseDetailResponse } from '@/types/course';

export const useCourseDetail = (courseId: number) => {
  const [courseDetail, setCourseDetail] = useState<CourseDetailResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await courseAPI.getCourseDetail(courseId);

        setCourseDetail(response.data);
      } catch (err) {
        setError('코스 상세 정보를 불러오는데 실패했습니다.');
        console.error('코스 상세 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  return {
    courseDetail,
    loading,
    error,
  };
};

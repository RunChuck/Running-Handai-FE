import { useQuery, useQueryClient } from '@tanstack/react-query';
import { courseAPI } from '@/api/course';
import { courseKeys } from '@/constants/queryKeys';
import type { CourseDetailData } from '@/types/course';

export const useCourseDetail = (courseId: number) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: async (): Promise<CourseDetailData> => {
      const response = await courseAPI.getCourseDetail(courseId);
      return response.data;
    },
    enabled: !!courseId && courseId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const setCourseDetail = (newData: CourseDetailData) => {
    queryClient.setQueryData(courseKeys.detail(courseId), newData);
  };

  return {
    courseDetail: query.data || null,
    setCourseDetail,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
};

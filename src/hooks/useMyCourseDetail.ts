import { useQuery } from '@tanstack/react-query';
import { getMyCourseDetail } from '@/api/create';
import { authKeys } from '@/constants/queryKeys';
import type { MyCourseDetail } from '@/types/create';

export const useMyCourseDetail = (courseId: number) => {
  const query = useQuery({
    queryKey: authKeys.myCourseDetail(courseId),
    queryFn: async (): Promise<MyCourseDetail> => {
      const response = await getMyCourseDetail(courseId);
      return response.data;
    },
    enabled: !!courseId && courseId > 0,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return {
    courseDetail: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
import { useQuery } from '@tanstack/react-query';
import { courseAPI } from '@/api/course';
import { courseKeys } from '@/constants/queryKeys';
import type { CourseSummaryData } from '@/types/course';

export const useCourseSummary = (courseId: number) => {
  const query = useQuery({
    queryKey: courseKeys.summary(courseId),
    queryFn: async (): Promise<CourseSummaryData> => {
      const response = await courseAPI.getCourseSummary(courseId);
      return response.data;
    },
    enabled: !!courseId && courseId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: query => {
      return query.state.data?.spotStatus === 'IN_PROGRESS' ? 3000 : false;
    },
  });

  return {
    summary: query.data,
    spotStatus: query.data?.spotStatus || 'COMPLETED',
    loading: query.isLoading,
    error: query.error?.message || null,
  };
};

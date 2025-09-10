import { useQuery } from '@tanstack/react-query';
import { getMyCourses } from '@/api/create';
import { authKeys } from '@/constants/queryKeys';
import type { MyCoursesRequest, SortBy } from '@/types/create';

export const useMyCourses = (sortBy: SortBy = 'latest') => {
  const query = useQuery({
    queryKey: authKeys.myCourses(sortBy),
    queryFn: () => getMyCourses({ sortBy } as MyCoursesRequest),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return {
    courses: query.data?.data.courses || [],
    courseCount: query.data?.data.myCourseCount || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

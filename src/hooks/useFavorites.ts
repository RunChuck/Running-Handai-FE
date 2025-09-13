import { useInfiniteQuery } from '@tanstack/react-query';
import { authAPI } from '@/api/auth';
import { authKeys } from '@/constants/queryKeys';
import { useAuth } from './useAuth';
import type { AreaCode } from '@/types/course';

interface UseFavoritesProps {
  area?: AreaCode | null;
}

export const useFavorites = ({ area }: UseFavoritesProps = {}) => {
  const { isAuthenticated } = useAuth();

  const query = useInfiniteQuery({
    queryKey: authKeys.bookmarkedCourses(area || undefined),
    queryFn: ({ pageParam = 0 }) => authAPI.getBookmarkedCourses(area || null, pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      const isLastPage = lastPage.data.isLastPage;
      return isLastPage ? undefined : allPages.length;
    },
    initialPageParam: 0,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  const allCourses = query.data?.pages.flatMap(page => page.data.courses) || [];
  const totalElements = query.data?.pages[0]?.data.totalElements || 0;

  return {
    courses: allCourses,
    totalElements,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    refetch: query.refetch,
  };
};

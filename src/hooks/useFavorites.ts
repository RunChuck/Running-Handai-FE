import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@/api/auth';
import { authKeys } from '@/constants/queryKeys';
import { useAuth } from './useAuth';
import type { AreaCode } from '@/types/course';

interface UseFavoritesProps {
  area?: AreaCode | null;
}

export const useFavorites = ({ area }: UseFavoritesProps = {}) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authKeys.bookmarkedCourses(area || undefined),
    queryFn: () => authAPI.getBookmarkedCourses(area || null),
    enabled: isAuthenticated,
  });
};
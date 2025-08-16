import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@/api/auth';
import { authKeys } from '@/constants/queryKeys';
import { useAuth } from './useAuth';

export const useMyReviews = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authKeys.myReviews(),
    queryFn: authAPI.getMyReviews,
    enabled: isAuthenticated,
  });
};
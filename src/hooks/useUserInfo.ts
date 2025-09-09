import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@/api/auth';
import { authKeys } from '@/constants/queryKeys';
import { useAuth } from './useAuth';

export const useUserInfo = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authKeys.userInfo(),
    queryFn: () => authAPI.getUserInfo(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

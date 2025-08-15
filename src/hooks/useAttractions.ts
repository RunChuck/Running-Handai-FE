import { useQuery } from '@tanstack/react-query';
import { courseAPI } from '@/api/course';
import { courseKeys } from '@/constants/queryKeys';
import type { AttractionData } from '@/types/course';

export const useAttractions = (courseId: number) => {
  const query = useQuery({
    queryKey: courseKeys.attractions(courseId),
    queryFn: async (): Promise<AttractionData[]> => {
      const response = await courseAPI.getAttractions(courseId);

      return [response.data];
    },
    enabled: !!courseId && courseId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    attractions: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
  };
};

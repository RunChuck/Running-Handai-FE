import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewAPI } from '@/api/review';
import { reviewKeys } from '@/constants/queryKeys';
import type { ReviewData, CreateReviewRequest } from '@/types/review';

export const useReviews = (courseId: number) => {
  const query = useQuery({
    queryKey: reviewKeys.list(courseId),
    queryFn: async (): Promise<ReviewData> => {
      const response = await reviewAPI.getReviews({ courseId });
      return response.data;
    },
    enabled: !!courseId && courseId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    reviewData: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (request: CreateReviewRequest) => {
      return await reviewAPI.createReview(request);
    },
    onSuccess: (_, variables) => {
      // 해당 코스의 리뷰 목록 무효화하여 새로고침
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(variables.courseId),
      });
    },
    onError: error => {
      console.error('Failed to create review:', error);
    },
  });

  return {
    createReview: mutation.mutate,
    createReviewAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    isSuccess: mutation.isSuccess,
  };
};

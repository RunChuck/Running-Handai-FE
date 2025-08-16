import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/useToast';
import { reviewAPI } from '@/api/review';
import { reviewKeys, courseKeys, authKeys } from '@/constants/queryKeys';
import { useAuth } from '@/hooks/useAuth';
import type {
  ReviewData,
  CreateReviewRequest,
  CreateReviewResponse,
  EditReviewRequest,
  EditReviewResponse,
  DeleteReviewRequest,
  DeleteReviewResponse,
} from '@/types/review';

interface UseReviewsProps {
  courseId: number;
  onLoginRequired?: () => void;
  skipQuery?: boolean;
}

interface UseReviewsReturn {
  // 데이터 조회
  reviewData: ReviewData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;

  // 리뷰 생성
  createReview: (request: CreateReviewRequest) => void;
  createReviewAsync: (request: CreateReviewRequest) => Promise<CreateReviewResponse>;
  isCreating: boolean;
  createError: string | null;
  isCreateSuccess: boolean;

  // 리뷰 수정
  editReview: (request: EditReviewRequest) => void;
  editReviewAsync: (request: EditReviewRequest) => Promise<EditReviewResponse>;
  isEditing: boolean;
  editError: string | null;
  isEditSuccess: boolean;

  // 리뷰 삭제
  deleteReview: (request: DeleteReviewRequest) => void;
  deleteReviewAsync: (request: DeleteReviewRequest) => Promise<DeleteReviewResponse>;
  isDeleting: boolean;
  deleteError: string | null;
  isDeleteSuccess: boolean;

  // 폼 상태
  rating: number;
  isReviewModalOpen: boolean;
  isLoginModalOpen: boolean;

  // 폼 핸들러
  handleRatingChange: (rating: number) => void;
  handleReviewSubmit: (reviewText: string, reviewRating?: number) => Promise<void>;
  handleLoginModalClose: () => void;
  handleReviewModalClose: () => void;
  checkAuthAndExecute: (callback: () => void) => boolean;
}

export const useReviews = ({ courseId, onLoginRequired, skipQuery = false }: UseReviewsProps): UseReviewsReturn => {
  const [t] = useTranslation();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  // 폼 상태
  const [rating, setRating] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // 디버깅용 로그
  // if (process.env.NODE_ENV === 'development') {
  //   console.log('useReviews:', { courseId, skipQuery, enabled: !!courseId && courseId > 0 && !skipQuery });
  // }

  // 리뷰 목록 조회
  const reviewQuery = useQuery({
    queryKey: reviewKeys.list(courseId),
    queryFn: async (): Promise<ReviewData> => {
      console.log('reviewAPI.getReviews called for courseId:', courseId);
      const response = await reviewAPI.getReviews({ courseId });
      return response.data;
    },
    enabled: !!courseId && courseId > 0 && !skipQuery,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 리뷰 생성
  const createMutation = useMutation({
    mutationFn: async (request: CreateReviewRequest) => {
      return await reviewAPI.createReview(request);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(variables.courseId),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.summary(variables.courseId),
      });
      queryClient.invalidateQueries({
        queryKey: authKeys.myReviews(),
      });
      showSuccessToast(t('toast.reviewSuccess'));
    },
    onError: error => {
      console.error('Failed to create review:', error);
      showErrorToast(t('toast.reviewFailed'));
    },
  });

  // 리뷰 수정
  const editMutation = useMutation({
    mutationFn: async (request: EditReviewRequest) => {
      return await reviewAPI.editReview(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.summary(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: authKeys.myReviews(),
      });
      showSuccessToast(t('toast.reviewUpdated'));
    },
    onError: error => {
      console.error('Failed to edit review:', error);
      showErrorToast(t('toast.reviewUpdateFailed'));
    },
  });

  // 리뷰 삭제
  const deleteMutation = useMutation({
    mutationFn: async (request: DeleteReviewRequest) => {
      return await reviewAPI.deleteReview(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.summary(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: authKeys.myReviews(),
      });
      showSuccessToast(t('toast.reviewDeleted'));
    },
    onError: error => {
      console.error('Failed to delete review:', error);
      showErrorToast(t('toast.reviewDeleteFailed'));
    },
  });

  // 인증 체크
  const checkAuthAndExecute = (callback: () => void): boolean => {
    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      } else {
        setIsLoginModalOpen(true);
      }
      return false;
    }
    callback();
    return true;
  };

  // 모달 핸들러
  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleReviewModalClose = () => {
    if (!createMutation.isPending) {
      setIsReviewModalOpen(false);
    }
  };

  const handleRatingChange = (newRating: number) => {
    checkAuthAndExecute(() => {
      setRating(newRating);
      setIsReviewModalOpen(true);
    });
  };

  const handleReviewSubmit = async (reviewText: string, reviewRating?: number) => {
    try {
      await createMutation.mutateAsync({
        courseId,
        stars: reviewRating || rating,
        contents: reviewText,
      });
      setIsReviewModalOpen(false);
      setRating(0);
    } catch (error) {
      console.error('Failed to create review:', error);
      throw error;
    }
  };

  return {
    // 데이터 조회
    reviewData: reviewQuery.data || null,
    loading: reviewQuery.isLoading,
    error: reviewQuery.error?.message || null,
    refetch: reviewQuery.refetch,

    // 리뷰 생성
    createReview: createMutation.mutate,
    createReviewAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message || null,
    isCreateSuccess: createMutation.isSuccess,

    // 리뷰 수정
    editReview: editMutation.mutate,
    editReviewAsync: editMutation.mutateAsync,
    isEditing: editMutation.isPending,
    editError: editMutation.error?.message || null,
    isEditSuccess: editMutation.isSuccess,

    // 리뷰 삭제
    deleteReview: deleteMutation.mutate,
    deleteReviewAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error?.message || null,
    isDeleteSuccess: deleteMutation.isSuccess,

    // 폼 상태
    rating,
    isReviewModalOpen,
    isLoginModalOpen,

    // 폼 핸들러
    handleRatingChange,
    handleReviewSubmit,
    handleLoginModalClose,
    handleReviewModalClose,
    checkAuthAndExecute,
  };
};

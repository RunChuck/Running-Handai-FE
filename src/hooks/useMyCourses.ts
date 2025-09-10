import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyCourses, deleteCourse, updateCourse } from '@/api/create';
import { authKeys } from '@/constants/queryKeys';
import { useToast } from '@/hooks/useToast';
import type { MyCoursesRequest, SortBy } from '@/types/create';

interface UsMyCoursesOptions {
  onDeleteSuccess?: () => void;
  onEditSuccess?: () => void;
}

export const useMyCourses = (sortBy: SortBy = 'latest', options: UsMyCoursesOptions = {}) => {
  const [t] = useTranslation();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const query = useQuery({
    queryKey: authKeys.myCourses(sortBy),
    queryFn: () => getMyCourses({ sortBy } as MyCoursesRequest),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  const handleDeleteClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async (courseId: number) => {
    if (!courseId) return;

    try {
      await deleteCourse(courseId);

      queryClient.invalidateQueries({ queryKey: authKeys.all });
      queryClient.invalidateQueries({
        predicate: query => {
          const [prefix, type] = query.queryKey;
          return prefix === 'courses' && type === 'list';
        },
      });

      setIsDeleteModalOpen(false);
      showSuccessToast(t('toast.courseDeleted'));
      options.onDeleteSuccess?.();
    } catch (error) {
      console.error('Course deletion failed:', error);
      showErrorToast(t('toast.courseDeleteFailed'));
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleEditConfirm = async (courseId: number, startPoint: string, endPoint: string) => {
    if (!courseId) return;

    try {
      await updateCourse(courseId, {
        startPointName: startPoint,
        endPointName: endPoint,
      });

      queryClient.invalidateQueries({
        predicate: query => {
          const [prefix, type] = query.queryKey;
          return prefix === 'auth' || (prefix === 'courses' && (type === 'list' || type === 'detail'));
        },
      });

      setIsEditModalOpen(false);
      showSuccessToast(t('toast.courseUpdated'));
      options.onEditSuccess?.();
    } catch (error) {
      console.error('Course update failed:', error);
      showErrorToast(t('toast.courseUpdateFailed'));
    }
  };

  return {
    courses: query.data?.data.courses || [],
    courseCount: query.data?.data.myCourseCount || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    // 삭제 관련
    deleteActions: {
      isDeleteModalOpen,
      handleDeleteClick,
      handleDeleteCancel,
      handleDeleteConfirm,
    },
    // 수정 관련
    editActions: {
      isEditModalOpen,
      handleEditClick,
      handleEditCancel,
      handleEditConfirm,
    },
  };
};

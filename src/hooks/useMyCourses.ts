import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyCourses, deleteCourse, updateCourse } from '@/api/create';
import { authKeys } from '@/constants/queryKeys';
import { useToast } from '@/hooks/useToast';
import type { MyCoursesRequest, SortBy } from '@/types/create';

// 내 코스 조회
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

interface UseMyCourseActionsOptions {
  onDeleteSuccess?: () => void;
  onEditSuccess?: () => void;
}

// 내 코스 수정, 삭제
export const useMyCourseActions = (options: UseMyCourseActionsOptions = {}) => {
  const [t] = useTranslation();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleEdit = async (courseId: number, startPoint: string, endPoint: string) => {
    await handleEditConfirm(courseId, startPoint, endPoint);
  };

  const handleDelete = async (courseId: number) => {
    await handleDeleteConfirm(courseId);
  };

  return {
    handleEdit,
    handleDelete,

    deleteActions: {
      isDeleteModalOpen,
      handleDeleteClick,
      handleDeleteCancel,
      handleDeleteConfirm,
    },
    editActions: {
      isEditModalOpen,
      handleEditClick,
      handleEditCancel,
      handleEditConfirm,
    },
  };
};

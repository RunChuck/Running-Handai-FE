import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courseAPI } from '@/api/course';
import { courseKeys } from '@/constants/queryKeys';
import { useAuth } from './useAuth';
import type { CourseData, CourseDetailData } from '@/types/course';

type BookmarkUpdate = {
  isBookmarked: boolean;
  bookmarks: number;
};

interface UseBookmarkProps {
  onUpdateCourse?: (courseId: number, updates: BookmarkUpdate) => void;
  onError?: (error: unknown) => void;
  onUnauthenticated?: () => void;
}

export const useBookmark = ({ onUpdateCourse, onError, onUnauthenticated }: UseBookmarkProps = {}) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: async ({ courseId, shouldBookmark }: { courseId: number; shouldBookmark: boolean }) => {
      if (shouldBookmark) {
        await courseAPI.bookmarkCourse(courseId);
      } else {
        await courseAPI.deleteBookmarkCourse(courseId);
      }
    },
    onSuccess: () => {
      // 코스 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
    onError: (error, { courseId, shouldBookmark }) => {
      // 실패시 UI 롤백
      onUpdateCourse?.(courseId, {
        isBookmarked: !shouldBookmark,
        bookmarks: 0, // 실제 값은 쿼리 재요청으로 업데이트
      });
      onError?.(error);
    },
  });

  const handleBookmark = async (course: CourseData | CourseDetailData) => {
    if (!isAuthenticated) {
      onUnauthenticated?.();
      return;
    }

    const shouldBookmark = !course.isBookmarked;

    onUpdateCourse?.(course.courseId, {
      isBookmarked: shouldBookmark,
      bookmarks: course.bookmarks + (shouldBookmark ? 1 : -1),
    });

    bookmarkMutation.mutate({ courseId: course.courseId, shouldBookmark });
  };

  return {
    handleBookmark,
    isLoading: bookmarkMutation.isPending,
  };
};

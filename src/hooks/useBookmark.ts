import { useState } from 'react';
import { courseAPI } from '@/api/course';
import { useAuth } from './useAuth';
import type { CourseData } from '@/types/course';

interface UseBookmarkProps {
  onUpdateCourse?: (courseId: number, updates: Partial<CourseData>) => void;
  onError?: (error: unknown) => void;
  onUnauthenticated?: () => void;
}

export const useBookmark = ({ onUpdateCourse, onError, onUnauthenticated }: UseBookmarkProps = {}) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleBookmark = async (course: CourseData) => {
    if (!isAuthenticated) {
      onUnauthenticated?.();
      return;
    }

    const shouldBookmark = !course.isBookmarked;

    try {
      onUpdateCourse?.(course.courseId, {
        isBookmarked: shouldBookmark,
        bookmarks: course.bookmarks + (shouldBookmark ? 1 : -1),
      });

      setIsLoading(true);

      if (shouldBookmark) {
        await courseAPI.bookmarkCourse({ courseId: course.courseId });
      } else {
        await courseAPI.deleteBookmarkCourse({ courseId: course.courseId });
      }
    } catch (error) {
      // 실패시 UI 상태 원래대로 되돌리기
      onUpdateCourse?.(course.courseId, {
        isBookmarked: !shouldBookmark,
        bookmarks: course.bookmarks + (!shouldBookmark ? 1 : -1),
      });
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleBookmark,
    isLoading,
  };
};

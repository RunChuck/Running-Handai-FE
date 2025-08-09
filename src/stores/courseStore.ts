import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AreaCode, ThemeCode } from '@/types/course';

export interface FilterState {
  type: 'nearby' | 'area' | 'theme';
  value?: AreaCode | ThemeCode;
  location?: { lat: number; lng: number };
}

interface CourseStoreState {
  // 상태
  selectedFilter: FilterState;
  selectedCourseId: number | undefined;

  // 액션
  setFilter: (filter: FilterState) => void;
  setSelectedCourse: (courseId: number | undefined) => void;
  updateCourseBookmark: (courseId: number, updates: { isBookmarked: boolean; bookmarks: number }) => void;
  reset: () => void;
}

// 초기 상태
const initialState = {
  selectedFilter: { type: 'nearby' } as FilterState,
  selectedCourseId: undefined,
};

export const useCourseStore = create<CourseStoreState>()(
  persist(
    (set, _get) => ({
      // 초기 상태
      ...initialState,

      // 필터 설정
      setFilter: (filter: FilterState) => {
        set({ selectedFilter: filter });
      },

      // 선택된 코스 설정
      setSelectedCourse: (courseId: number | undefined) => {
        set({ selectedCourseId: courseId });
      },

      // 북마크 상태 업데이트 (현재는 상태만 업데이트, 실제 캐시 업데이트는 hook에서)
      updateCourseBookmark: (courseId: number, updates: { isBookmarked: boolean; bookmarks: number }) => {
        // 이 액션은 나중에 useCourses에서 호출할 예정
        // 여기서는 로컬 상태만 업데이트하거나 추가 로직을 처리할 수 있음
        console.log(`Bookmark updated for course ${courseId}:`, updates);
      },

      // 상태 초기화
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'course-state', // 세션스토리지 키 이름
      storage: createJSONStorage(() => sessionStorage),
      // 필요한 상태만 persist (location은 제외)
      partialize: state => ({
        selectedFilter: {
          type: state.selectedFilter.type,
          value: state.selectedFilter.value,
          // location은 세션스토리지에 저장하지 않음 (매번 새로 가져오기)
        },
        selectedCourseId: state.selectedCourseId,
      }),
    }
  )
);

export type CourseTabType = 'overview' | 'course' | 'attractions' | 'reviews';

export interface CourseTabItem {
  key: CourseTabType;
  label: string;
}

export interface CourseData {
  id: number;
  title: string;
  thumbnail: string;
  bookmarkCount: number;
  distance: string;
  duration: string;
  elevation: string;
  isBookmarked?: boolean;
}

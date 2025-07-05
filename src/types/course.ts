export type CourseTabType = 'overview' | 'course' | 'attractions' | 'reviews';

export interface CourseTabItem {
  key: CourseTabType;
  label: string;
}

export interface CourseData {
  thumbnailUrl: string;
  distanceFromUser: number;
  distance: number;
  maxElevation: number;
  id: number;
  duration: number;
}

export interface CourseRequest {
  filter: string;
  lat: number;
  lon: number;
  area?: string;
  theme?: string;
}

export interface CourseResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: CourseData[];
}

interface TrackPoint {
  lat: number;
  lon: number;
  ele: number;
}

interface CourseDetailData {
  courseId: number;
  distance: number;
  duration: number;
  minelevation: number;
  maxElevation: number;
  level: string;
  roadConditions: string[];
  trackPoints: TrackPoint[];
}

export interface CourseDetailResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: CourseDetailData;
}

export interface CourseMockData {
  id: number;
  title: string;
  thumbnail: string;
  bookmarkCount: number;
  distance: string;
  duration: string;
  elevation: string;
  isBookmarked?: boolean;
}

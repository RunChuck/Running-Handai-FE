export type CourseTabType = 'overview' | 'course' | 'attractions' | 'reviews';

export interface CourseTabItem {
  key: CourseTabType;
  label: string;
}

export interface CourseData {
  courseId: number;
  thumbnailUrl: string;
  distance: number;
  duration: number;
  maxElevation: number;
  distanceFromUser: number;
  bookmarks: number;
  isBookmarked: boolean;
  trackPoints?: TrackPoint[];
}

export type CourseFilterType = 'NEARBY' | 'AREA' | 'THEME';

export type AreaCode =
  | 'HAEUN_GWANGAN'
  | 'SONGJEONG_GIJANG'
  | 'SEOMYEON_DONGNAE'
  | 'WONDOSIM'
  | 'SOUTHERN_COAST'
  | 'WESTERN_NAKDONGRIVER'
  | 'NORTHERN_BUSAN';

export type ThemeCode = 'SEA' | 'DOWNTOWN' | 'RIVERSIDE' | 'MOUNTAIN';

export interface CourseRequest {
  filter: CourseFilterType;
  lat: number;
  lon: number;
  area?: AreaCode;
  theme?: ThemeCode;
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
  minElevation: number;
  maxElevation: number;
  level: string;
  bookmarks: number;
  isBookmarked: boolean;
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

export interface BookmarkRequest {
  courseId: number;
}

export interface BookmarkResponse {
  statusCode: number;
  responseCode: string;
  message: string;
}

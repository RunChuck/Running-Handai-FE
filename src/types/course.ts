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

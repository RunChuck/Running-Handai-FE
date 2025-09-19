export interface CourseNameCheckResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  data: boolean;
}

export interface LocationCheckRequest {
  lat: number;
  lon: number;
}

export interface LocationCheckResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  data: boolean;
}

export interface CourseCreateRequest {
  startPointName: string;
  endPointName: string;
  gpxFile: File;
  thumbnailImage: File;
  isInsideBusan: boolean;
}

export interface CourseCreateResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  data: number;
}

export interface Course {
  distanceFromUser?: number;
  thumbnailUrl: string;
  maxElevation: number;
  distance: number;
  courseName: string;
  courseId: number;
  duration: number;
  createdAt?: string;
}

export interface MyCoursesResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  data: {
    myCourseCount: number;
    courses: Course[];
  };
}

export type SortBy = 'latest' | 'oldest' | 'short' | 'long';

export interface MyCoursesRequest {
  page?: number;
  size?: number;
  sortBy?: SortBy;
  keyword?: string;
}

export interface CourseUpdateRequest {
  startPointName: string;
  endPointName: string;
  thumbnailImage?: File;
}

export interface TrackPoint {
  lat: number;
  lon: number;
  ele: number;
}

export interface MyCourseDetail {
  courseId: number;
  name: string;
  distance: number;
  duration: number;
  maxElevation: number;
  minElevation: number;
  trackPoints: TrackPoint[];
}

export interface MyCourseDetailResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: MyCourseDetail;
}

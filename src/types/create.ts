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
  name: string;
  id: number;
  duration: number;
  createdAt?: string;
}

export interface MyCoursesResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  data: {
    courseCount: number;
    courses: Course[];
  };
}

export type SortBy = 'latest' | 'oldest' | 'short' | 'long';

export interface MyCoursesRequest {
  sortBy?: SortBy;
}

export interface CourseUpdateRequest {
  startPointName: string;
  endPointName: string;
  thumbnailImage?: File;
}

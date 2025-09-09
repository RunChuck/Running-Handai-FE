import type { AreaCode } from './course';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface BookmarkedCourseData {
  bookmarkId: number;
  courseId: number;
  thumbnailUrl: string;
  bookmarkCount: number;
  isBookmarked: boolean;
}

export interface MyCourseData {
  courseId: number;
  courseName: string;
  thumbnailUrl: string;
  distance: number;
  duration: number;
  maxElevation: number;
  createdAt: string;
}

export interface UserInfo {
  nickname: string;
  email: string;
  bookmarkInfo: {
    bookmarkCount: number;
    courses: BookmarkedCourseData[];
  };
  myCourseInfo: {
    myCourseCount: number;
    courses: MyCourseData[];
  };
}

export interface UserInfoResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  data: UserInfo;
}

export interface CheckNicknameResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: boolean;
}

export interface BookmarkedCourse {
  bookmarkId: number;
  courseId: number;
  thumbnailUrl: string;
  isBookmarked: boolean;
  bookmarkCount: number;
}

export interface BookmarkedCoursesResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: BookmarkedCourse[];
}

export interface Review {
  reviewId: number;
  courseId: number;
  courseName: string;
  thumbnailUrl: string;
  area: AreaCode;
  distance: number;
  duration: number;
  maxElevation: number;
  stars: number;
  contents: string;
  createdAt: string;
}

export interface MyReviewsResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: Review[];
}

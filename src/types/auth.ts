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

export interface UserInfo {
  nickname: string;
  email: string;
}

export interface UserInfoResponse {
  statusCode: number;
  responseCode: string;
  message: string;
  totalCount: number;
  data: {
    nickname: string;
    email: string;
  };
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
  distance: number;
  duration: number;
  maxElevation: number;
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

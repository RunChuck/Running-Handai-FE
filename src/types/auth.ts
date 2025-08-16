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

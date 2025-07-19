export type OAuthProvider = 'kakao' | 'naver' | 'google';

export interface LoginRequest {
  provider: OAuthProvider;
}

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

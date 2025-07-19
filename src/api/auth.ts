import { http } from '@/constants/http';
import type { OAuthProvider, RefreshTokenRequest, RefreshTokenResponse } from '@/types/auth';

const PREFIX = 'api';

export const authAPI = {
  // OAuth 로그인 요청
  initiateOAuthLogin: async (provider: OAuthProvider) => {
    const response = await http.get(`${PREFIX}/oauth2/authorization/${provider}`);
    return response.data;
  },

  // 토큰 재발급
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const requestData: RefreshTokenRequest = { refreshToken };
    const response = await http.post<RefreshTokenResponse>(`${PREFIX}/members/oauth/token`, requestData);
    return response.data;
  },
};

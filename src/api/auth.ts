import { http } from '@/constants/http';
import type { RefreshTokenRequest, RefreshTokenResponse, UserInfoResponse, CheckNicknameResponse } from '@/types/auth';

const PREFIX = 'api/members';

export const authAPI = {
  // 토큰 재발급
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const requestData: RefreshTokenRequest = { refreshToken };
    const response = await http.post<RefreshTokenResponse>(`${PREFIX}/oauth/token`, requestData);
    return response.data;
  },

  getUserInfo: async (): Promise<UserInfoResponse> => {
    const response = await http.get<UserInfoResponse>(`${PREFIX}/me`);
    return response.data;
  },

  checkNickname: async (value: string): Promise<CheckNicknameResponse> => {
    const response = await http.get<CheckNicknameResponse>(`${PREFIX}/nickname`, { params: { value } });
    return response.data;
  },

  updateUserInfo: async (nickname: string): Promise<UserInfoResponse> => {
    const response = await http.patch<UserInfoResponse>(`${PREFIX}/me`, { nickname });
    return response.data;
  },
};

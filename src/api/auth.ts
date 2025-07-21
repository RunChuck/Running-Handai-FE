import { http } from '@/constants/http';
import type { RefreshTokenRequest, RefreshTokenResponse } from '@/types/auth';

const PREFIX = 'api';

export const authAPI = {
  // 토큰 재발급
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const requestData: RefreshTokenRequest = { refreshToken };
    const response = await http.post<RefreshTokenResponse>(`${PREFIX}/members/oauth/token`, requestData);
    return response.data;
  },
};

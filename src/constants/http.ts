import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Vite 환경변수 설정
const envConfig = {
  apiRoot: import.meta.env.VITE_API_ROOT,
  isDev: import.meta.env.DEV,
  adminLoginEndpoint: import.meta.env.VITE_ADMIN_LOGIN_ENDPOINT,
} as const;

// Axios 인스턴스 생성
const client: AxiosInstance = axios.create({
  baseURL: envConfig.apiRoot,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (envConfig.isDev) {
      console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, config.data);
    }

    // 토큰이 있으면 Authorization 헤더에 추가
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || sessionStorage.getItem('tempAccessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 토큰 재발급 중인지 확인하는 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// 응답 인터셉터
client.interceptors.response.use(
  (response: AxiosResponse) => {
    if (envConfig.isDev) {
      console.log(`✅ [${response.status}] ${response.config.url}`, response.data);
    }
    return response;
  },
  async error => {
    const { response, config } = error;

    // 개발 환경에서만 에러 로깅
    if (envConfig.isDev) {
      console.error(`❌ [${response?.status}] ${error.config?.url}`, error.response?.data);
    }

    // 401 에러이고 토큰 재발급 또는 관리자 로그인 API가 아닌 경우
    if (response?.status === 401 && !config.url?.includes('oauth/token') && !config.url?.includes(envConfig.adminLoginEndpoint)) {
      if (!isRefreshing) {
        isRefreshing = true;
        const isAutoLogin = localStorage.getItem('autoLogin') === 'true';
        const refreshToken = isAutoLogin ? localStorage.getItem('refreshToken') : sessionStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            const expiredAccessToken = isAutoLogin ? localStorage.getItem('accessToken') : sessionStorage.getItem('accessToken');

            if (envConfig.isDev) {
              console.log('토큰 재발급 시도:', {
                isAutoLogin,
                refreshToken: refreshToken.slice(0, 10) + '...',
                hasExpiredToken: !!expiredAccessToken,
              });
            }

            const refreshResponse = await axios.post(`${envConfig.apiRoot}/api/members/oauth/token`, {
              refreshToken,
              ...(expiredAccessToken && { accessToken: expiredAccessToken }),
            });

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

            if (!newAccessToken) {
              console.error('❌ 새 액세스 토큰이 응답에 없음:', refreshResponse.data);
              throw new Error('Invalid token response: accessToken is missing');
            }

            // 새 토큰 저장
            if (isAutoLogin) {
              localStorage.setItem('accessToken', newAccessToken);
              if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
              }
            } else {
              sessionStorage.setItem('accessToken', newAccessToken);
              if (newRefreshToken) {
                sessionStorage.setItem('refreshToken', newRefreshToken);
              }
            }

            isRefreshing = false;
            processQueue(null, newAccessToken);

            // 원래 요청 재시도
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            return client(config);
          } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError, undefined);

            // 리프레시 토큰도 만료된 경우 로그아웃 처리
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('autoLogin');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');

            window.location.href = '/?session=expired';

            return Promise.reject(refreshError);
          }
        } else {
          // 리프레시 토큰이 없는 경우 로그아웃
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('autoLogin');
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');

          window.location.href = '/?session=expired';
        }
      } else {
        // 이미 토큰 재발급 중인 경우 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            config.headers.Authorization = `Bearer ${token}`;
            return client(config);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
    }

    return Promise.reject(error);
  }
);

export { client as http };

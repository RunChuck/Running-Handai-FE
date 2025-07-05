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
} as const;

// Axios 인스턴스 생성
const client: AxiosInstance = axios.create({
  baseURL: envConfig.apiRoot,
  timeout: 10000,
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

    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
client.interceptors.response.use(
  (response: AxiosResponse) => {
    if (envConfig.isDev) {
      console.log(`✅ [${response.status}] ${response.config.url}`, response.data);
    }
    return response;
  },
  error => {
    const { response } = error;

    // 개발 환경에서만 에러 로깅
    if (envConfig.isDev) {
      console.error(`❌ [${response?.status}] ${error.config?.url}`, error.response?.data);
    }

    return Promise.reject(error);
  }
);

export { client as http };

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { useUserStore } from '@/stores/userStore';
import { authAPI } from '@/api/auth';
import { authKeys } from '@/constants/queryKeys';

interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();
  const { setUserInfo, clearUserInfo } = useUserStore();
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  const setToken = (accessToken: string, refreshToken?: string, autoLogin?: boolean, userEmail?: string) => {
    const isTestAccount = userEmail === import.meta.env.VITE_TEST_ACCOUNT;
    const shouldAutoLogin =
      isTestAccount ||
      autoLogin ||
      sessionStorage.getItem('tempAutoLoginPreference') === 'true' ||
      localStorage.getItem('autoLoginPreference') === 'true';

    if (shouldAutoLogin) {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('autoLogin', 'true');
    } else {
      sessionStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        sessionStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.removeItem('autoLogin');
    }

    // 사용 후 제거
    localStorage.removeItem('autoLoginPreference');
    sessionStorage.removeItem('tempAutoLoginPreference');
  };

  const getToken = () => {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  };

  const removeToken = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('autoLogin');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  };

  const isAuthenticated = () => {
    return !!getToken();
  };

  const handleOAuthCallback = async () => {
    setState({ isLoading: true, error: null });

    try {
      if (isAuthenticated()) {
        navigate('/course', { replace: true });
        return;
      }

      // URL 파라미터에서 토큰 추출
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const error = searchParams.get('error');

      if (error) {
        setState({ isLoading: false, error: error });
        showErrorToast(error);
        return;
      }

      if (accessToken) {
        // 먼저 임시로 토큰 저장하여 사용자 정보 조회
        sessionStorage.setItem('tempAccessToken', accessToken);

        //  userStore에 저장
        try {
          const userInfoResponse = await authAPI.getUserInfo();
          const userEmail = userInfoResponse.data.email;

          // 사용자 이메일과 함께 토큰 설정
          setToken(accessToken, refreshToken || undefined, undefined, userEmail);

          setUserInfo({
            nickname: userInfoResponse.data.nickname,
            email: userEmail,
          });

          // 임시 토큰 제거
          sessionStorage.removeItem('tempAccessToken');
        } catch (error) {
          console.error('Failed to fetch user info after login:', error);
          // 실패 시 기본 동작
          setToken(accessToken, refreshToken || undefined);
          sessionStorage.removeItem('tempAccessToken');
        }

        showSuccessToast(t('toast.loginSuccess'), { position: 'top' });
        navigate('/course', { replace: true });
      } else {
        const errorMsg = t('toast.loginFailed');
        setState({ isLoading: false, error: errorMsg });
        showErrorToast(errorMsg, { position: 'top' });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : t('toast.error');
      setState({
        isLoading: false,
        error: errorMsg,
      });
      showErrorToast(errorMsg, { position: 'top' });
    }
  };

  const logout = () => {
    removeToken();
    clearUserInfo();
    sessionStorage.clear();
    queryClient.removeQueries({ queryKey: authKeys.all });
    showSuccessToast(t('toast.logoutSuccess'), { position: 'top' });
    navigate('/', { replace: true });
  };

  return {
    ...state,
    isAuthenticated: isAuthenticated(),
    setToken,
    getToken,
    removeToken,
    handleOAuthCallback,
    logout,
  };
};

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { useUserStore } from '@/stores/userStore';
import { authAPI } from '@/api/auth';

interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccessToast, showErrorToast } = useToast();
  const { setUserInfo, clearUserInfo } = useUserStore();
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  const setToken = (accessToken: string, refreshToken?: string, autoLogin?: boolean) => {
    const shouldAutoLogin =
      autoLogin ?? (sessionStorage.getItem('tempAutoLoginPreference') === 'true' || localStorage.getItem('autoLoginPreference') === 'true');

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
        setToken(accessToken, refreshToken || undefined);

        //  userStore에 저장
        try {
          const userInfoResponse = await authAPI.getUserInfo();
          setUserInfo({
            nickname: userInfoResponse.data.nickname,
            email: userInfoResponse.data.email,
          });
        } catch (error) {
          console.error('Failed to fetch user info after login:', error);
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

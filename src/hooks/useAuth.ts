import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';

interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccessToast, showErrorToast } = useToast();
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  const setToken = (accessToken: string, refreshToken?: string) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  };

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const removeToken = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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

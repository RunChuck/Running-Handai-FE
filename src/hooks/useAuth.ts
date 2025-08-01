import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
        return;
      }

      if (accessToken) {
        setToken(accessToken, refreshToken || undefined);
        navigate('/course', { replace: true });
      } else {
        setState({ isLoading: false, error: '토큰을 받지 못했습니다.' });
      }
    } catch (err) {
      setState({
        isLoading: false,
        error: err instanceof Error ? err.message : '인증 처리 중 오류가 발생했습니다.',
      });
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

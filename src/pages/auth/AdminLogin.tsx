import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './Login.styled';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useUserStore } from '@/stores/userStore';
import { authAPI } from '@/api/auth';

import Button from '@/components/Button';
import CommonInput from '@/components/CommonInput';
import PrimaryLogoSrc from '@/assets/images/logo-primary.png';
import WhiteLogoSrc from '@/assets/images/logo-white.png';

const AdminLogin = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const isMobile = useIsMobile();
  const { isAuthenticated, setToken } = useAuth();
  const { showInfoToast, showSuccessToast, showErrorToast } = useToast();
  const { setUserInfo } = useUserStore();

  const handleAdminSubmit = async () => {
    try {
      const response = await authAPI.adminLogin({
        email: adminId,
        password: adminPassword,
      });

      // 토큰 저장 (테스트 계정은 무조건 자동 로그인 - useAuth에서 처리)
      setToken(response.data.accessToken, response.data.refreshToken, undefined, adminId);

      // 사용자 정보 조회 및 저장
      try {
        const userInfoResponse = await authAPI.getUserInfo();
        setUserInfo({
          nickname: userInfoResponse.data.nickname,
          email: userInfoResponse.data.email,
        });
      } catch (error) {
        console.error('Failed to fetch user info after admin login:', error);
      }

      showSuccessToast(t('toast.loginSuccess'), { position: 'top' });
      navigate('/course', { replace: true });
    } catch (error) {
      console.error('Admin login failed:', error);
      showErrorToast(t('toast.loginFailed'), { position: 'top' });
    }
  };

  const buttonSize = isMobile ? 'md' : 'lg';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/course');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const sessionParam = searchParams.get('session');
    if (sessionParam === 'expired') {
      showInfoToast(t('toast.sessionExpired'), { position: 'top' });
      navigate('/', { replace: true });
    }
  }, []);

  return (
    <S.Container>
      <S.LoginContainer>
        <S.LogoWrapper>
          <img src={isMobile ? WhiteLogoSrc : PrimaryLogoSrc} alt="러닝한다이" />
        </S.LogoWrapper>
        <S.ButtonWrapper>
          <S.AdminInputGroup>
            <S.AdminText>{t('login.adminLogin')}</S.AdminText>
            <S.InputWrapper>
              <S.InputLabel>{t('login.adminLogin.id')}</S.InputLabel>
              <CommonInput placeholder="테스트 계정 아이디를 입력하세요" value={adminId} onChange={setAdminId} type="text" />
            </S.InputWrapper>
            <S.InputWrapper>
              <S.InputLabel>{t('login.adminLogin.password')}</S.InputLabel>
              <CommonInput placeholder="비밀번호를 입력하세요" value={adminPassword} onChange={setAdminPassword} type="password" />
            </S.InputWrapper>

            <Button
              fullWidth
              size={buttonSize}
              variant={isMobile ? 'secondary' : 'primary'}
              onClick={handleAdminSubmit}
              disabled={!adminId || !adminPassword}
            >
              {t('login.login')}
            </Button>
          </S.AdminInputGroup>
        </S.ButtonWrapper>
      </S.LoginContainer>
    </S.Container>
  );
};

export default AdminLogin;

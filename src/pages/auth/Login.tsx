import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './Login.styled';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

import Button from '@/components/Button';
import CommonInput from '@/components/CommonInput';
import MetaTags from '@/components/MetaTags';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import SVGColor from '@/components/SvgColor';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowIconSrc from '@/assets/icons/arrow-left-24px.svg';
import GoogleIconSrc from '@/assets/icons/google-icon.svg';
import KakaoIconSrc from '@/assets/icons/kakao-icon.svg';
import NaverIconSrc from '@/assets/icons/naver-icon.svg';
import PrimaryLogoSrc from '@/assets/images/logo-primary.png';
import WhiteLogoSrc from '@/assets/images/logo-white.png';

const Login = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAutoLoginChecked, setIsAutoLoginChecked] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const { showInfoToast } = useToast();
  const handleAutoLoginToggle = () => {
    setIsAutoLoginChecked(!isAutoLoginChecked);
  };

  const handleAdminLogin = () => {
    setIsAdminMode(true);
  };

  const handleBackToSocial = () => {
    setIsAdminMode(false);
    setAdminId('');
    setAdminPassword('');
  };

  const handleAdminSubmit = () => {
    // TODO: 관리자 로그인 API 호출
    console.log('Admin login:', { adminId, adminPassword });
  };

  const buttonSize = isMobile ? 'md' : 'lg';

  const state = import.meta.env.DEV ? 'local' : 'prod';

  const loginButtons = [
    {
      id: 'google',
      text: t('login.google'),
      backgroundColor: '#fff',
      icon: <img src={GoogleIconSrc} alt="Google" width="20" height="20" />,
      style: { color: 'var(--text-text-title, #1C1C1C)', border: '1px solid #dadce0' },
      onClick: () => {
        localStorage.setItem('autoLoginPreference', isAutoLoginChecked.toString());
        sessionStorage.setItem('tempAutoLoginPreference', isAutoLoginChecked.toString());
        window.location.href = `${import.meta.env.VITE_API_ROOT}/oauth2/authorization/google?state=${state}`;
      },
    },
    {
      id: 'kakao',
      text: t('login.kakao'),
      backgroundColor: '#FEE500',
      icon: <img src={KakaoIconSrc} alt="Kakao" width="20" height="20" />,
      style: { color: 'var(--text-text-title, #1C1C1C)' },
      onClick: () => {
        localStorage.setItem('autoLoginPreference', isAutoLoginChecked.toString());
        sessionStorage.setItem('tempAutoLoginPreference', isAutoLoginChecked.toString());
        window.location.href = `${import.meta.env.VITE_API_ROOT}/oauth2/authorization/kakao?state=${state}`;
      },
    },
    {
      id: 'naver',
      text: t('login.naver'),
      backgroundColor: '#03C75A',
      icon: <img src={NaverIconSrc} alt="Naver" width="20" height="20" />,
      style: {},
      onClick: () => {
        localStorage.setItem('autoLoginPreference', isAutoLoginChecked.toString());
        sessionStorage.setItem('tempAutoLoginPreference', isAutoLoginChecked.toString());
        window.location.href = `${import.meta.env.VITE_API_ROOT}/oauth2/authorization/naver?state=${state}`;
      },
    },
    {
      id: 'guest',
      text: t('login.guest'),
      backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.10)' : 'var(--GrayScale-gray200)',
      icon: null,
      style: {
        color: isMobile ? 'var(--text-text-inverse, #fff)' : 'var(--text-text-title, #1C1C1C)',
        border: isMobile ? '1px solid #fff' : 'none',
      },
      onClick: () => navigate('/course'),
    },
  ];

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
      <MetaTags />
      <PWAInstallPrompt />
      <S.LoginContainer>
        <S.LogoWrapper>
          <img src={isMobile ? WhiteLogoSrc : PrimaryLogoSrc} alt="러닝한다이" />
        </S.LogoWrapper>
        <S.ButtonWrapper>
          {!isAdminMode ? (
            <>
              <S.ButtonGroup>
                {loginButtons.map(button => (
                  <Button
                    key={button.id}
                    fullWidth
                    size={buttonSize}
                    backgroundColor={button.backgroundColor}
                    startIcon={button.icon}
                    iconPosition={button.icon ? 'left' : undefined}
                    style={button.style}
                    onClick={button.onClick}
                  >
                    {button.text}
                  </Button>
                ))}
                <S.AdminLogin onClick={handleAdminLogin}>
                  <S.AdminLoginText>{t('login.adminLogin.title')}</S.AdminLoginText>
                </S.AdminLogin>
              </S.ButtonGroup>

              <S.AutoLogin onClick={handleAutoLoginToggle}>
                {isAutoLoginChecked ? (
                  <CheckBoxIcon color={isMobile ? 'inherit' : 'disabled'} />
                ) : (
                  <CheckBoxOutlineBlankIcon color={isMobile ? 'inherit' : 'disabled'} />
                )}
                {t('login.autoLogin')}
              </S.AutoLogin>
            </>
          ) : (
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
                backgroundColor="var(--primary-primary)"
                onClick={handleAdminSubmit}
                disabled={!adminId || !adminPassword}
              >
                {t('login.login')}
              </Button>
              <S.BackButton onClick={handleBackToSocial}>
                <SVGColor src={ArrowIconSrc} width="20" height="20" color={isMobile ? '#BBBBBB' : '#1C1C1C'} />
                <S.BackButtonText>{t('login.backToSocial')}</S.BackButtonText>
              </S.BackButton>
            </S.AdminInputGroup>
          )}
        </S.ButtonWrapper>
      </S.LoginContainer>
    </S.Container>
  );
};

export default Login;

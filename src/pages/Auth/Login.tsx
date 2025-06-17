import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './Login.styled';

import Button from '@/components/Button';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import GoogleIconSrc from '@/assets/icons/google-icon.svg';
import KakaoIconSrc from '@/assets/icons/kakao-icon.svg';
import NaverIconSrc from '@/assets/icons/naver-icon.svg';

const Login = () => {
  const navigate = useNavigate();
  const [isAutoLoginChecked, setIsAutoLoginChecked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleAutoLoginToggle = () => {
    setIsAutoLoginChecked(!isAutoLoginChecked);
  };

  const buttonSize = isMobile ? 'md' : 'lg';

  const loginButtons = [
    {
      id: 'google',
      text: 'Google 로그인',
      backgroundColor: '#fff',
      icon: <img src={GoogleIconSrc} alt="Google" width="20" height="20" />,
      style: { color: 'var(--text-text-title, #1C1C1C)', border: '1px solid #dadce0' },
      onClick: () => {
        // TODO: 구글 로그인
      },
    },
    {
      id: 'kakao',
      text: 'Kakao 로그인',
      backgroundColor: '#FEE500',
      icon: <img src={KakaoIconSrc} alt="Kakao" width="20" height="20" />,
      style: { color: 'var(--text-text-title, #1C1C1C)' },
      onClick: () => {
        // TODO: 카카오 로그인
      },
    },
    {
      id: 'naver',
      text: 'Naver 로그인',
      backgroundColor: '#03C75A',
      icon: <img src={NaverIconSrc} alt="Naver" width="20" height="20" />,
      style: {},
      onClick: () => {
        // TODO: 네이버 로그인
      },
    },
    {
      id: 'guest',
      text: '게스트로 이용하기',
      backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.10)' : 'var(--GrayScale-gray200)',
      icon: null,
      style: {
        color: isMobile ? 'var(--text-text-inverse, #fff)' : 'var(--text-text-title, #1C1C1C)',
        border: isMobile ? '1px solid #fff' : 'none',
      },
      onClick: () => navigate('/main'),
    },
  ];

  return (
    <S.Container>
      <S.LoginContainer>
        <S.TitleWrapper>
          <S.TempLogo>R</S.TempLogo>
          <S.Title>러닝한다이</S.Title>
        </S.TitleWrapper>
        <S.ButtonWrapper>
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
          </S.ButtonGroup>
          <S.AutoLogin onClick={handleAutoLoginToggle}>
            {isAutoLoginChecked ? (
              <CheckBoxIcon color={isMobile ? 'inherit' : 'disabled'} />
            ) : (
              <CheckBoxOutlineBlankIcon color={isMobile ? 'inherit' : 'disabled'} />
            )}
            자동 로그인
          </S.AutoLogin>
        </S.ButtonWrapper>
      </S.LoginContainer>
    </S.Container>
  );
};

export default Login;

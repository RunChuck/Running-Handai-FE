import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './Login.styled';

import Button from '@/components/common/Button';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import GoogleIconSrc from '@/assets/icons/google-icon.svg';
import KakaoIconSrc from '@/assets/icons/kakao-icon.svg';
import NaverIconSrc from '@/assets/icons/naver-icon.svg';

const Login = () => {
  const navigate = useNavigate();
  const [isAutoLoginChecked, setIsAutoLoginChecked] = useState(false);

  const handleAutoLoginToggle = () => {
    setIsAutoLoginChecked(!isAutoLoginChecked);
  };

  return (
    <S.Container>
      <S.LoginContainer>
        <S.TitleWrapper>
          <S.TempLogo>R</S.TempLogo>
          <S.Title>러닝한다이</S.Title>
        </S.TitleWrapper>
        <S.ButtonWrapper>
          <S.ButtonGroup>
            <Button
              fullWidth
              size="lg"
              backgroundColor="#fff"
              startIcon={<img src={GoogleIconSrc} alt="Google" width="20" height="20" />}
              iconPosition="left"
              style={{ color: 'var(--text-text-title, #1C1C1C)', border: '1px solid #dadce0' }}
            >
              Google 로그인
            </Button>
            <Button
              fullWidth
              size="lg"
              backgroundColor="#FEE500"
              startIcon={<img src={KakaoIconSrc} alt="Kakao" width="20" height="20" />}
              iconPosition="left"
              style={{ color: 'var(--text-text-title, #1C1C1C)' }}
            >
              Kakao 로그인
            </Button>
            <Button
              fullWidth
              size="lg"
              backgroundColor="#03C75A"
              startIcon={<img src={NaverIconSrc} alt="Naver" width="20" height="20" />}
              iconPosition="left"
            >
              Naver 로그인
            </Button>
            <Button
              fullWidth
              size="lg"
              backgroundColor="var(--GrayScale-gray200)"
              style={{ color: 'var(--text-text-title, #1C1C1C)' }}
              onClick={() => navigate('/main')}
            >
              게스트로 이용하기
            </Button>
          </S.ButtonGroup>
          <S.AutoLogin onClick={handleAutoLoginToggle}>
            {isAutoLoginChecked ? <CheckBoxIcon color="disabled" /> : <CheckBoxOutlineBlankIcon color="disabled" />}
            자동 로그인
          </S.AutoLogin>
        </S.ButtonWrapper>
      </S.LoginContainer>
    </S.Container>
  );
};

export default Login;

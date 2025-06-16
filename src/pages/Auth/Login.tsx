import * as S from './Login.styled';

const Login = () => {
  return (
    <S.Container>
      <S.LoginContainer>
        <S.TitleWrapper>
          <S.TempLogo>R</S.TempLogo>
          <S.Title>러닝한다이</S.Title>
        </S.TitleWrapper>
        <S.ButtonWrapper>
          <S.ButtonGroup>
            <S.Button>Google 로그인</S.Button>
            <S.Button>Kakao 로그인</S.Button>
            <S.Button>Naver 로그인</S.Button>
            <S.Button>게스트로 이용하기</S.Button>
          </S.ButtonGroup>
          <S.AutoLogin>자동 로그인</S.AutoLogin>
        </S.ButtonWrapper>
      </S.LoginContainer>
    </S.Container>
  );
};

export default Login;

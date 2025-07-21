import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Lottie from 'lottie-react';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/styles/theme';

import LoadingMotion from '@/assets/animations/run-loading.json';
import NoCourseImgSrc from '@/assets/images/sad-emoji.png';

const Auth = () => {
  const [t] = useTranslation();
  const { handleOAuthCallback, error } = useAuth();

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (error) {
    return (
      <Container>
        <img src={NoCourseImgSrc} alt="" width={100} height={100} />
        <ErrorText>{t('login.error')}</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <Lottie animationData={LoadingMotion} style={{ width: 150, height: 150 }} loop={true} />
    </Container>
  );
};

export default Auth;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: var(--spacing-16);
`;

const ErrorText = styled.div`
  ${theme.typography.body1};
  color: var(--text-text-secondary, #555555);
  text-align: center;
  white-space: pre-line;
`;

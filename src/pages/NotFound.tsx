import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import Button from '@/components/Button';
import NotFoundImgSrc from '@/assets/images/not-found.png';

const NotFound = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <NotFoundImg src={NotFoundImgSrc} alt="not found" />
      <Content>
        <NotFoundText>{t('notFound.text')}</NotFoundText>
        <NotFoundDesc>{t('notFound.desc')}</NotFoundDesc>
      </Content>
      <Button fullWidth onClick={() => navigate('/')}>
        {t('notFound.button')}
      </Button>
    </Container>
  );
};

export default NotFound;

const Container = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-surface-highlight2, #eeeeee);
  padding: 0 var(--spacing-16);
  gap: var(--spacing-24);
`;

const NotFoundImg = styled.img`
  width: auto;
  height: 120px;

  @media (max-width: 600px) {
    height: 80px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-8);
`;

const NotFoundText = styled.span`
  ${theme.typography.title2}
  color: var(--text-text-title, #1c1c1c);

  @media (max-width: 600px) {
    ${theme.typography.subtitle1}
  }
`;

const NotFoundDesc = styled.span`
  ${theme.typography.body1}
  color: var(--text-text-secondary, #555555);
  white-space: pre-wrap;
  text-align: center;

  @media (max-width: 600px) {
    ${theme.typography.body2}
  }
`;

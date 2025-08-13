import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

import Header from '../components/Header';

const TermsPage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <Header title={t('mypage.terms.title')} onBack={() => navigate(-1)} />
    </Container>
  );
};

export default TermsPage;

const Container = styled.div``;

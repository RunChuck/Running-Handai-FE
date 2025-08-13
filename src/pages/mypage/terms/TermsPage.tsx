import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

import Header from '../components/Header';
import ToolTip from './ToopTip';

const TermsPage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <Header title={t('mypage.terms.title')} onBack={() => navigate(-1)} />
      <ToolTip />
    </Container>
  );
};

export default TermsPage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: var(--spacing-32);
`;

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

import Header from '../../../components/Header';
import ToolTip from './ToopTip';
import KeyTab from './KeyTab';

const TermsPage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <Header title={t('mypage.terms.title')} onBack={() => navigate(-1)} />
      <ToolTip />
      <KeyTab />
    </Container>
  );
};

export default TermsPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

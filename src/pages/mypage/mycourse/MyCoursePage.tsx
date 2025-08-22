import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Header from '@/components/Header';
import MyCourseCard from '../components/MyCourseCard';

const MyCoursePage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <Header title={t('mypage.myCourse')} onBack={() => navigate(-1)} />
      <Content>
        <CardGrid>
          <MyCourseCard variant="grid" />
          <MyCourseCard variant="grid" />
          <MyCourseCard variant="grid" />
          <MyCourseCard variant="grid" />
          <MyCourseCard variant="grid" />
          <MyCourseCard variant="grid" />
        </CardGrid>
      </Content>
    </Container>
  );
};

export default MyCoursePage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: var(--spacing-32);
`;

const Content = styled.div`
  padding: 0 var(--spacing-16);
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: var(--spacing-24);

  @media (max-width: 600px) {
    column-gap: 16px;
  }
`;

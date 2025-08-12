import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useIsMobile } from '@/hooks/useIsMobile';

import Header from '../components/Header';
import CourseFilter from './CourseFilter';
import FavoriteCourseItem from './FavoriteCourseItem';

const FavoritePage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <Container>
      <Header title={t('mypage.favorites.title')} onBack={() => navigate(-1)} />
      <CourseFilter />
      <CourseGrid isMobile={isMobile}>
        <FavoriteCourseItem />
        <FavoriteCourseItem />
        <FavoriteCourseItem />
        <FavoriteCourseItem />
        <FavoriteCourseItem />
      </CourseGrid>
    </Container>
  );
};

export default FavoritePage;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: var(--spacing-32);
`;

const CourseGrid = styled.div<{ isMobile: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0 var(--spacing-16);
  row-gap: var(--spacing-24);
  column-gap: var(--spacing-12);

  ${({ isMobile }) =>
    isMobile &&
    css`
      grid-template-columns: repeat(2, 1fr);
    `}
`;

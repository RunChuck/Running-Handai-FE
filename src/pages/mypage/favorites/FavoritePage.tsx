import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { css } from '@emotion/react';
import { useIsMobile } from '@/hooks/useIsMobile';

import Header from '../components/Header';
import CourseFilter from './CourseFilter';
import FavoriteCourseItem from './FavoriteCourseItem';
import EmptyIconSrc from '@/assets/icons/no-course.svg';

const FavoritePage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // 테스트용
  const favoriteCourseCount = 0;

  return (
    <Container>
      <Header title={t('mypage.favorites.title')} onBack={() => navigate(-1)} />
      <CourseFilter />
      {favoriteCourseCount > 0 ? (
        <CourseGrid isMobile={isMobile}>
          <FavoriteCourseItem />
          <FavoriteCourseItem />
          <FavoriteCourseItem />
          <FavoriteCourseItem />
          <FavoriteCourseItem />
          <FavoriteCourseItem />
          <FavoriteCourseItem />
        </CourseGrid>
      ) : (
        <EmptyContainer>
          <img src={EmptyIconSrc} alt="empty" />
          <EmptyText>{t('mypage.favorites.empty')}</EmptyText>
        </EmptyContainer>
      )}
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

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 var(--spacing-16);
  padding: var(--spacing-24) 0;
  gap: var(--spacing-16);
`;

const EmptyText = styled.p`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
`;
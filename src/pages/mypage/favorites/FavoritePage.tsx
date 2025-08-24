import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { css } from '@emotion/react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useFavorites } from '@/hooks/useFavorites';
import type { AreaCode } from '@/types/course';

import Header from '@/components/Header';
import CourseFilter from './CourseFilter';
import FavoriteCourseItem from './FavoriteCourseItem';
import EmptyIconSrc from '@/assets/icons/no-course.svg';
import LoadingMotion from '@/assets/animations/run-loading.json';

const FavoritePage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedArea, setSelectedArea] = useState<AreaCode | null>(null);

  const { data: favoritesData, isLoading } = useFavorites({ area: selectedArea });
  const favorites = favoritesData?.data || [];
  const favoriteCourseCount = favorites.length;

  return (
    <Container>
      <Header title={t('mypage.favorites.title')} onBack={() => navigate(-1)} />
      <CourseFilter selectedArea={selectedArea} onAreaChange={setSelectedArea} />
      {isLoading ? (
        <StatusContainer>
          <Lottie animationData={LoadingMotion} style={{ width: 100, height: 100 }} loop={true} />
        </StatusContainer>
      ) : favoriteCourseCount > 0 ? (
        <CourseGrid isMobile={isMobile}>
          {favorites.map(course => (
            <FavoriteCourseItem key={course.courseId} course={course} />
          ))}
        </CourseGrid>
      ) : (
        <StatusContainer>
          <img src={EmptyIconSrc} alt="empty" />
          <EmptyText>{t('mypage.favorites.empty')}</EmptyText>
        </StatusContainer>
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

const StatusContainer = styled.div`
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

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';
import styled from '@emotion/styled';
import * as S from '../Main.styled';
import { theme } from '@/styles/theme';
import { useIsMobile } from '@/hooks/useIsMobile';

import { THEME_CARDS } from '@/constants/themes';
import type { CourseData, ThemeCode } from '@/types/course';

import CourseItem from './CourseItem';
import LoadingMotion from '@/assets/animations/run-loading.json';
import NoCourseImgSrc from '@/assets/images/sad-emoji.png';

interface CourseListProps {
  courses: CourseData[];
  loading: boolean;
  error: string | null;
  selectedCourseId?: number;
  onBookmarkClick: () => void;
  onThemeSelect: (theme: ThemeCode) => void;
  fetchNearbyCourses: () => void;
}

const CourseList = ({ courses, loading, error, selectedCourseId, onBookmarkClick, onThemeSelect, fetchNearbyCourses }: CourseListProps) => {
  const [t] = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleThemeCardClick = (themeKey: ThemeCode) => {
    onThemeSelect(themeKey);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Lottie animationData={LoadingMotion} style={{ width: 100, height: 100 }} loop={true} />
        <S.StatusText>{t('main.loading')}</S.StatusText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <img src={NoCourseImgSrc} alt={t('main.noCourses')} width={57} height={60} />
        <S.StatusText>{error}</S.StatusText>
        <S.RetryButton onClick={fetchNearbyCourses}>{t('retry')}</S.RetryButton>
      </ErrorContainer>
    );
  }

  if (courses.length === 0) {
    return (
      <StatusContainer>
        <img src={NoCourseImgSrc} alt={t('main.noCourses')} width={57} height={60} />
        <S.StatusText>{isMobile ? t('main.noCourses.mobile') : t('main.noCourses')}</S.StatusText>
        <ThemeCourseCardContainer
          ref={scrollContainerRef}
          onWheel={e => {
            e.currentTarget.scrollLeft += e.deltaY;
          }}
          onMouseDown={handleMouseDown}
        >
          {THEME_CARDS.map(card => (
            <ThemeCourseCard key={card.key} onClick={() => handleThemeCardClick(card.key)}>
              <ThemeCourseCardTitle>{t(card.titleKey)}</ThemeCourseCardTitle>
              <ThemeCourseCardText>{t(card.descriptionKey)}</ThemeCourseCardText>
            </ThemeCourseCard>
          ))}
        </ThemeCourseCardContainer>
      </StatusContainer>
    );
  }

  return (
    <S.CourseGrid>
      {courses.map((course, index) => (
        <CourseItem
          key={course.courseId}
          course={course}
          index={index}
          isSelected={course.courseId === selectedCourseId}
          onBookmarkClick={onBookmarkClick}
        />
      ))}
    </S.CourseGrid>
  );
};

export default CourseList;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-12);
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-24) 0;
  gap: var(--spacing-12);

  img {
    margin: 0 auto;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-12);
  padding: var(--spacing-24) 0;
`;

const ThemeCourseCardContainer = styled.div`
  display: flex;
  gap: var(--spacing-8);
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  margin: 0 calc(-1 * var(--spacing-16));
  padding: 0 var(--spacing-16);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ThemeCourseCard = styled.div`
  min-width: 164px;
  flex-shrink: 0;
  height: 66px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: var(--surface-surface-highlight3, #f7f8fa);
  padding: var(--spacing-12) var(--spacing-24);
  margin-top: var(--spacing-12);
  cursor: pointer;
`;

const ThemeCourseCardTitle = styled.span`
  ${theme.typography.caption1}
  color: var(--text-text-title, #1c1c1c);
`;

const ThemeCourseCardText = styled.span`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
`;

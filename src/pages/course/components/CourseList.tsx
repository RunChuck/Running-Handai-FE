import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';
import styled from '@emotion/styled';
import * as S from '../Course.styled';
import { theme } from '@/styles/theme';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';

import { THEME_CARDS } from '@/constants/themes';
import type { CourseData, ThemeCode } from '@/types/course';

import CourseItem from './CourseItem';
import { SVGColor } from '@/components/SvgColor';
import LoadingMotion from '@/assets/animations/run-loading.json';
import NoCourseImgSrc from '@/assets/images/sad-emoji.png';
import ArrowIconSrc from '@/assets/icons/arrow-right-16px.svg';

interface CourseListProps {
  courses: CourseData[];
  loading: boolean;
  error: string | null;
  selectedCourseId?: number;
  onBookmarkClick: (course: CourseData) => void;
  onThemeSelect: (theme: ThemeCode) => void;
  fetchNearbyCourses: () => void;
  onCourseClick?: (courseId: number) => void;
}

const CourseList = ({
  courses,
  loading,
  error,
  selectedCourseId,
  onBookmarkClick,
  onThemeSelect,
  fetchNearbyCourses,
  onCourseClick,
}: CourseListProps) => {
  const [t] = useTranslation();
  const isMobile = useIsMobile();
  const { scrollContainerRef, handleMouseDown, handleWheel } = useHorizontalScroll();

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
        <ThemeCourseCardContainer ref={scrollContainerRef} onWheel={handleWheel} onMouseDown={handleMouseDown}>
          {THEME_CARDS.map(card => (
            <ThemeCourseCard key={card.key} onClick={() => handleThemeCardClick(card.key)}>
              <ThemeCourseCardTitle>
                {t(card.titleKey)}
                <SVGColor src={ArrowIconSrc} width={16} height={16} color="#4561FF" />
              </ThemeCourseCardTitle>
              {/* <ThemeCourseCardText>{t(card.descriptionKey)}</ThemeCourseCardText> */}
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
          onBookmarkClick={() => onBookmarkClick(course)}
          onCourseClick={() => onCourseClick?.(course.courseId)}
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
  justify-content: safe center;
  gap: var(--spacing-8);
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  margin: 0 calc(-1 * var(--spacing-16));
  padding: 0 var(--spacing-16);

  /* 터치 동작 개선 */
  touch-action: pan-x;

  /* 드래그 시 선택 방지 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ThemeCourseCard = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-12) var(--spacing-24);
  border-radius: 8px;
  background: var(--surface-surface-highlight3, #f7f8fa);
  padding: var(--spacing-12) var(--spacing-24);
  margin-top: var(--spacing-12);
  cursor: pointer;

  &:hover {
    background: var(--surface-surface-highlight, #f4f4f4);
  }
`;

const ThemeCourseCardTitle = styled.span`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  ${theme.typography.caption1}
  color: var(--text-text-primary, #4561FF);
`;

// const ThemeCourseCardText = styled.span`
//   ${theme.typography.body2}
//   color: var(--text-text-primary, #4561FF);
// `;

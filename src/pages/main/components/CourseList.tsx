import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';
import * as S from '../Main.styled';

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
      <S.LoadingContainer>
        <Lottie animationData={LoadingMotion} style={{ width: 100, height: 100 }} loop={true} />
        <S.StatusText>{t('main.loading')}</S.StatusText>
      </S.LoadingContainer>
    );
  }

  if (error) {
    return (
      <S.ErrorContainer>
        <img src={NoCourseImgSrc} alt={t('main.noCourses')} width={57} height={60} />
        <S.StatusText>{error}</S.StatusText>
        <S.RetryButton onClick={fetchNearbyCourses}>{t('retry')}</S.RetryButton>
      </S.ErrorContainer>
    );
  }

  if (courses.length === 0) {
    return (
      <S.StatusContainer>
        <img src={NoCourseImgSrc} alt={t('main.noCourses')} width={57} height={60} />
        <S.StatusText>{t('main.noCourses')}</S.StatusText>
        <S.ThemeCourseCardContainer
          ref={scrollContainerRef}
          onWheel={e => {
            e.currentTarget.scrollLeft += e.deltaY;
          }}
          onMouseDown={handleMouseDown}
        >
          {THEME_CARDS.map(card => (
            <S.ThemeCourseCard key={card.key} onClick={() => handleThemeCardClick(card.key)}>
              <S.ThemeCourseCardTitle>{t(card.titleKey)}</S.ThemeCourseCardTitle>
              <S.ThemeCourseCardText>{t(card.descriptionKey)}</S.ThemeCourseCardText>
            </S.ThemeCourseCard>
          ))}
        </S.ThemeCourseCardContainer>
      </S.StatusContainer>
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

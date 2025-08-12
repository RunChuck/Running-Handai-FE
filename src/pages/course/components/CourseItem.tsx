import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { theme } from '@/styles/theme';
import type { CourseData } from '@/types/course';

import HeartIconSrc from '@/assets/icons/heart-default.svg';
import HeartIconFilledSrc from '@/assets/icons/heart-filled.svg';
import DefaultThumbnailImgSrc from '@/assets/images/thumbnail-default.png';

interface CourseItemProps {
  course: CourseData;
  index: number;
  isSelected?: boolean;
  onBookmarkClick: () => void;
  onCourseClick?: () => void;
}

const CourseItem = ({ course, index, isSelected, onBookmarkClick, onCourseClick }: CourseItemProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkClick();
  };

  const handleClick = () => {
    onCourseClick?.();
    navigate(`/course-detail/${course.courseId}`, {
      state: { course },
    });
  };

  // 인덱스를 알파벳으로 변환 (A, B, ..., Z, AA, AB, ...)
  const getCourseName = (index: number) => {
    let result = '';
    let num = index;

    do {
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26) - 1;
    } while (num >= 0);

    return `${result}${t('course')} `;
  };

  return (
    <ItemContainer>
      <ThumbnailWrapper onClick={handleClick} isSelected={isSelected}>
        <CourseBadge>{getCourseName(index)}</CourseBadge>
        <BookmarkButton onClick={handleBookmarkClick}>
          {course.isBookmarked ? <img src={HeartIconFilledSrc} alt="북마크" /> : <img src={HeartIconSrc} alt="북마크" />}
        </BookmarkButton>
        <Thumbnail src={course.thumbnailUrl || DefaultThumbnailImgSrc} alt="코스 썸네일" />
        <CourseStats>
          {course.distance}km · {course.duration}
          {t('minutes')} · {course.maxElevation}m
        </CourseStats>
      </ThumbnailWrapper>
      <CourseInfo>
        <CourseName>{course.courseName}</CourseName>
        <BookmarkCount>
          {course.bookmarks}
          {t('main.bookmark')}
        </BookmarkCount>
      </CourseInfo>
    </ItemContainer>
  );
};

export default CourseItem;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
`;

const ThumbnailWrapper = styled.div<{ isSelected?: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid var(--primary-primary, #4561ff);
    border-radius: 4px;
    opacity: ${props => (props.isSelected ? 1 : 0)};
    transition: opacity 0.2s ease;
    pointer-events: none;
    z-index: 2;
  }

  transition: all 0.2s ease;
`;

const CourseBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  ${theme.typography.label1}
  background: var(--text-text-title, #1c1c1c);
  color: var(--surface-surface-default, #ffffff);
  border-radius: 500px;
  padding: 5px 10px;
  z-index: 1;
`;

const BookmarkButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  background: transparent;
  border: none;
  cursor: pointer;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

const CourseStats = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 49px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
  color: var(--text-text-inverse, #ffffff);
  ${theme.typography.body2}
  padding: 0 var(--spacing-8) 4px var(--spacing-8);
  border-radius: 0 0 4px 4px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const CourseName = styled.div`
  ${theme.typography.subtitle3}
  color: var(--text-text-title, #1c1c1c);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  width: 100%;
`;

const BookmarkCount = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
`;

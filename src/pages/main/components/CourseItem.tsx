import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import HeartIconSrc from '@/assets/icons/heart-default.svg';
import HeartIconFilledSrc from '@/assets/icons/heart-filled.svg';

export interface CourseData {
  id: number;
  title: string;
  thumbnail: string;
  bookmarkCount: number;
  distance: string;
  duration: string;
  elevation: string;
  isBookmarked?: boolean;
}

interface CourseItemProps {
  course: CourseData;
  onBookmarkClick: () => void;
}

const CourseItem = ({ course, onBookmarkClick }: CourseItemProps) => {
  return (
    <ItemContainer>
      <ThumbnailWrapper>
        <CourseBadge>{course.title}</CourseBadge>
        <BookmarkButton onClick={onBookmarkClick}>
          <img src={course.isBookmarked ? HeartIconFilledSrc : HeartIconSrc} alt="heart" />
        </BookmarkButton>
        <Thumbnail src={course.thumbnail} alt="thumbnail" />
        <CourseStats>
          {course.distance} · {course.duration} · {course.elevation}
        </CourseStats>
      </ThumbnailWrapper>
      <BookmarkCount>{course.bookmarkCount}명이 저장한 코스</BookmarkCount>
    </ItemContainer>
  );
};

export default CourseItem;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
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

const BookmarkCount = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
`;

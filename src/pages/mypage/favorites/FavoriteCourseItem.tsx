import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useBookmark } from '@/hooks/useBookmark';
import type { BookmarkedCourse } from '@/types/auth';

import HeartIconFilledSrc from '@/assets/icons/heart-filled.svg';
import DefaultThumbnailSrc from '@/assets/images/thumbnail-default.png';

interface FavoriteCourseItemProps {
  course: BookmarkedCourse;
}

const FavoriteCourseItem = ({ course }: FavoriteCourseItemProps) => {
  const navigate = useNavigate();
  const { handleBookmarkById } = useBookmark();

  const handleCardClick = () => {
    navigate(`/course-detail/${course.courseId}`);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleBookmarkById(course.courseId, course.isBookmarked);
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <ThumbnailWrapper>
        <BookmarkButton onClick={handleBookmarkClick}>
          <img src={HeartIconFilledSrc} width={20} height={20} />
        </BookmarkButton>
        <img src={course.thumbnailUrl || DefaultThumbnailSrc} alt="북마크한 코스" />
        <CourseStats>
          {course.distance}km · {course.duration}분 · {course.maxElevation}m
        </CourseStats>
      </ThumbnailWrapper>
      <CourseName>{course.courseName}</CourseName>
    </CardContainer>
  );
};

export default FavoriteCourseItem;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  cursor: pointer;
  width: 100%;
  min-width: 0;
`;

const ThumbnailWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BookmarkButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
`;

const CourseName = styled.span`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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

import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useBookmark } from '@/hooks/useBookmark';
import type { BookmarkedCourse } from '@/types/auth';

import HeartIconFilledSrc from '@/assets/icons/heart-filled.svg';
import DefaultThumbnailSrc from '@/assets/images/thumbnail-default.png';

interface FavoriteCourseCardProps {
  course: BookmarkedCourse;
  onUpdateCourse?: (courseId: number, updates: { isBookmarked: boolean; bookmarks: number }) => void;
}

const FavoriteCourseCard = ({ course, onUpdateCourse }: FavoriteCourseCardProps) => {
  const navigate = useNavigate();
  const { handleBookmarkById } = useBookmark({ onUpdateCourse });

  const handleCardClick = () => {
    navigate(`/course-detail/${course.courseId}`, {
      state: { course },
    });
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
        <img src={course.thumbnailUrl || DefaultThumbnailSrc} alt="북마크된 코스" />
      </ThumbnailWrapper>
      <CourseName>{course.courseName}</CourseName>
    </CardContainer>
  );
};

export default FavoriteCourseCard;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 126px;
  gap: var(--spacing-8);
  cursor: pointer;

  @media (max-width: 600px) {
    width: 100px;
  }
`;

const ThumbnailWrapper = styled.div`
  width: 126px;
  height: 126px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
  }

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

import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { CourseData } from '@/types/course';

import HeartIconSrc from '@/assets/icons/heart-default.svg';
// import HeartIconFilledSrc from '@/assets/icons/heart-filled.svg';
import TempThumbnailImgSrc from '@/assets/images/temp-thumbnail.png';

interface CourseItemProps {
  course: CourseData;
  onBookmarkClick: () => void;
  index: number;
}

const CourseItem = ({ course, onBookmarkClick, index }: CourseItemProps) => {
  const navigate = useNavigate();

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkClick();
  };

  const handleClick = () => {
    navigate(`/course-detail/${course.courseId}`, {
      state: { course },
    });
  };

  // 인덱스를 알파벳으로 변환
  const getCourseName = (index: number) => {
    return `${String.fromCharCode(65 + index)}코스`;
  };

  return (
    <ItemContainer>
      <ThumbnailWrapper onClick={handleClick}>
        <CourseBadge>{getCourseName(index)}</CourseBadge>
        <BookmarkButton onClick={handleBookmarkClick}>
          {/* 현재는 모든 코스가 북마크되지 않은 상태로 처리 */}
          <img src={HeartIconSrc} alt="북마크" />
        </BookmarkButton>
        <Thumbnail src={TempThumbnailImgSrc} alt="코스 썸네일" />
        <CourseStats>
          {course.distance}km · {course.duration}분 · {course.maxElevation}m
        </CourseStats>
      </ThumbnailWrapper>
      {/* 임시로 북마크 수는 랜덤 값으로 표시 */}
      <BookmarkCount>{Math.floor(Math.random() * 100) + 1}명이 저장한 코스</BookmarkCount>
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
  cursor: pointer;
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

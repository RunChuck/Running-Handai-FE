import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import HeartIconFilledSrc from '@/assets/icons/heart-filled.svg';
import TempThumbnailImgSrc from '@/assets/images/temp-courseCard.png';

const FavoriteCourseCard = () => {
  // TODO: 코스 상세 페이지로 이동
  const handleCardClick = () => {
    console.log('card clicked');
  };

  // TODO: 북마크 클릭 이벤트 처리
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('bookmark clicked');
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <ThumbnailWrapper>
        <BookmarkButton onClick={handleBookmarkClick}>
          <img src={HeartIconFilledSrc} width={20} height={20} />
        </BookmarkButton>
        <img src={TempThumbnailImgSrc} />
      </ThumbnailWrapper>
      <BookmarkCount>4444명이 저장한 코스</BookmarkCount>
    </CardContainer>
  );
};

export default FavoriteCourseCard;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 126px;
  gap: var(--spacing-8);
  cursor: pointer;
`;

const ThumbnailWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 1/1;
  }
`;

const BookmarkButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
`;

const BookmarkCount = styled.span`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

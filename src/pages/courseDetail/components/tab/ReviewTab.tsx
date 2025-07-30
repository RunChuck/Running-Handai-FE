import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import StarIconSrc from '@/assets/icons/star-default.svg';
import StarFilledIconSrc from '@/assets/icons/star-filled.svg';
import StarHalfIconSrc from '@/assets/icons/star-half.svg';
import { calculateRatingFromPosition } from '@/utils/starRating';

const ReviewTab = () => {
  const [t] = useTranslation();
  const [rating, setRating] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [previewRating, setPreviewRating] = useState(0);

  const getClientX = (event: React.MouseEvent | React.TouchEvent): number => {
    return 'touches' in event ? event.touches[0].clientX : event.clientX;
  };

  const handleStarClick = (starIndex: number, event: React.MouseEvent<HTMLImageElement>) => {
    if (isDragging) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const starWidth = rect.width;
    const isLeftHalf = clickX < starWidth / 2;

    setRating(starIndex + (isLeftHalf ? 0.5 : 1));
  };

  const handleStart = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = getClientX(event);
    const newRating = calculateRatingFromPosition(clientX, rect);
    setPreviewRating(newRating);
  };

  const handleMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = getClientX(event);
    const newRating = calculateRatingFromPosition(clientX, rect);
    setPreviewRating(newRating);
  };

  const handleEnd = (event?: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clientX = getClientX(event);
      const newRating = calculateRatingFromPosition(clientX, rect);
      setRating(newRating);
    } else {
      setRating(previewRating);
    }

    setIsDragging(false);
    setPreviewRating(0);
  };

  return (
    <Container>
      <RatingContainer>
        <RatingText>{t('courseDetail.firstReviewer')}</RatingText>
        <RatingIconWrapper
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={() => {
            if (isDragging) {
              setIsDragging(false);
              setPreviewRating(0);
            }
          }}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={() => handleEnd()}
        >
          {[...Array(5)].map((_, index) => {
            const currentRating = isDragging ? previewRating : rating;
            const isFullStar = index < Math.floor(currentRating);
            const isHalfStar = index === Math.floor(currentRating) && currentRating % 1 === 0.5;

            let starSrc = StarIconSrc;
            if (isFullStar) {
              starSrc = StarFilledIconSrc;
            } else if (isHalfStar) {
              starSrc = StarHalfIconSrc;
            }

            return <StarIcon key={index} src={starSrc} alt="star" onClick={event => handleStarClick(index, event)} draggable={false} />;
          })}
        </RatingIconWrapper>
      </RatingContainer>
    </Container>
  );
};

export default ReviewTab;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-24) var(--spacing-16);
`;

const RatingContainer = styled.div`
  background-color: var(--surface-surface-highlight3, #f7f8fa);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  padding: var(--spacing-24);
  gap: var(--spacing-4);
`;

const RatingText = styled.span`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

const StarIcon = styled.img`
  transition: transform 0.1s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const RatingIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  user-select: none;
  touch-action: none;
  padding: var(--spacing-8);
  margin: calc(var(--spacing-8) * -1);
`;

import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import StarIconSrc from '@/assets/icons/star-default.svg';
import StarFilledIconSrc from '@/assets/icons/star-filled.svg';
import StarHalfIconSrc from '@/assets/icons/star-half.svg';
import { calculateRatingFromPosition } from '@/utils/starRating';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
  label?: string;
  padding?: number;
}

const StarRating = ({ 
  rating, 
  onRatingChange, 
  disabled = false,
  label,
  padding = 24
}: StarRatingProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewRating, setPreviewRating] = useState(0);

  const getClientX = (event: React.MouseEvent | React.TouchEvent): number => {
    return 'touches' in event ? event.touches[0].clientX : event.clientX;
  };

  const handleStarClick = (starIndex: number, event: React.MouseEvent<HTMLImageElement>) => {
    if (isDragging || disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const starWidth = rect.width;
    const isLeftHalf = clickX < starWidth / 2;

    onRatingChange(starIndex + (isLeftHalf ? 0.5 : 1));
  };

  const handleStart = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (disabled) return;

    setIsDragging(true);
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = getClientX(event);
    const newRating = calculateRatingFromPosition(clientX, rect);
    setPreviewRating(newRating);
  };

  const handleMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = getClientX(event);
    const newRating = calculateRatingFromPosition(clientX, rect);
    setPreviewRating(newRating);
  };

  const handleEnd = (event?: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || disabled) return;

    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clientX = getClientX(event);
      const newRating = calculateRatingFromPosition(clientX, rect);
      onRatingChange(newRating);
    } else {
      onRatingChange(previewRating);
    }

    setIsDragging(false);
    setPreviewRating(0);
  };

  return (
    <Container $padding={padding}>
      {label && <RatingText>{label}</RatingText>}
      <RatingIconWrapper
        $disabled={disabled}
        onMouseDown={!disabled ? handleStart : undefined}
        onMouseMove={!disabled ? handleMove : undefined}
        onMouseUp={!disabled ? handleEnd : undefined}
        onMouseLeave={() => {
          if (isDragging && !disabled) {
            setIsDragging(false);
            setPreviewRating(0);
          }
        }}
        onTouchStart={!disabled ? handleStart : undefined}
        onTouchMove={!disabled ? handleMove : undefined}
        onTouchEnd={!disabled ? () => handleEnd() : undefined}
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

          return (
            <StarIcon 
              key={index} 
              src={starSrc} 
              alt="star"
              $disabled={disabled}
              onClick={!disabled ? event => handleStarClick(index, event) : undefined}
              draggable={false} 
            />
          );
        })}
      </RatingIconWrapper>
    </Container>
  );
};

export default StarRating;

const Container = styled.div<{ $padding: number }>`
  background-color: var(--surface-surface-highlight3, #f7f8fa);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  padding: ${({ $padding }) => `var(--spacing-${$padding})`};
  gap: var(--spacing-4);
`;

const RatingText = styled.span`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

const StarIcon = styled.img<{ $disabled: boolean }>`
  width: 21px;
  height: 20px;
  transition: transform 0.1s ease;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};

  &:hover {
    transform: ${({ $disabled }) => $disabled ? 'none' : 'scale(1.1)'};
  }
`;

const RatingIconWrapper = styled.div<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  user-select: none;
  touch-action: ${({ $disabled }) => $disabled ? 'auto' : 'none'};
`;
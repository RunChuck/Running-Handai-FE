import styled from '@emotion/styled';
import { useState } from 'react';
import { theme } from '@/styles/theme';
import type { SpotData } from '@/types/course';
import { formatDescription } from '@/utils/format';

import AttractionTumbnailSrc from '@/assets/images/thumbnail-default.png';

interface AttractionItemProps {
  spot: SpotData;
  onMoreClick?: (spot: SpotData, buttonElement: HTMLButtonElement) => void;
  hideMoreButton?: boolean;
}

const AttractionItem = ({ spot, onMoreClick, hideMoreButton = false }: AttractionItemProps) => {
  const [needsTruncation, setNeedsTruncation] = useState(false);

  if (!spot) {
    return null;
  }

  const checkTextOverflow = (element: HTMLParagraphElement | null) => {
    if (element) {
      setNeedsTruncation(element.scrollHeight > element.clientHeight);
    }
  };

  const handleMoreButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMoreClick?.(spot, event.currentTarget);
  };

  return (
    <Container>
      <ThumbnailWrapper>
        <Thumbnail
          src={spot.imageUrl || AttractionTumbnailSrc}
          alt={spot.name}
          onError={e => {
            e.currentTarget.src = AttractionTumbnailSrc;
          }}
        />
      </ThumbnailWrapper>
      <Title>{spot.name}</Title>
      <DescriptionContainer>
        <DescriptionTruncated>
          <Description ref={checkTextOverflow}>{formatDescription(spot.description)}</Description>
          {!hideMoreButton && needsTruncation && <MoreButton onClick={handleMoreButtonClick}>...더보기</MoreButton>}
        </DescriptionTruncated>
      </DescriptionContainer>
    </Container>
  );
};

export default AttractionItem;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  position: relative;
`;

const ThumbnailWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--spacing-4);
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Title = styled.span`
  ${theme.typography.caption1};
  color: var(--text-text-title, #1c1c1c);
`;

const DescriptionContainer = styled.div`
  position: relative;
`;

const DescriptionTruncated = styled.div`
  position: relative;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Description = styled.p`
  ${theme.typography.caption3};
  color: var(--text-text-secondary, #555555);
  line-height: 1.4;
  word-break: break-word;
  margin: 0;
`;

const MoreButton = styled.button`
  ${theme.typography.caption2};
  color: var(--text-text-secondary, #555555);
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border: none;
  padding-left: 2px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

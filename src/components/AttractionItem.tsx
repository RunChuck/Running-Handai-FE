import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { SpotData } from '@/types/course';

import AttractionTumbnailSrc from '@/assets/images/temp-attraction.png';

interface AttractionItemProps {
  spot: SpotData;
}

const AttractionItem = ({ spot }: AttractionItemProps) => {
  if (!spot) {
    return null;
  }

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
      <Description>{spot.description}</Description>
    </Container>
  );
};

export default AttractionItem;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  cursor: pointer;
`;

const ThumbnailWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
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

const Description = styled.p`
  ${theme.typography.caption3};
  color: var(--text-text-secondary, #555555);

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  word-break: break-word;
`;

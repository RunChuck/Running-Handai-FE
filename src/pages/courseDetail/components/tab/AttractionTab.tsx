import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useState } from 'react';
import { useAttractions } from '@/hooks/useAttractions';
import AttractionItem from '@/components/AttractionItem';
import type { SpotData } from '@/types/course';
import CloseIconSrc from '@/assets/icons/close-24px.svg';

interface AttractionTabProps {
  courseId: number;
}

const AttractionTab = ({ courseId }: AttractionTabProps) => {
  const [t] = useTranslation();
  const { attractions, loading, error } = useAttractions(courseId);
  const [selectedSpot, setSelectedSpot] = useState<SpotData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleMoreClick = (spot: SpotData, buttonElement: HTMLButtonElement) => {
    const rect = buttonElement.getBoundingClientRect();
    const tooltipWidth = Math.min(568, window.innerWidth - 32);

    // pc에서는 스크롤바 width 고려
    const scrollbarOffset = window.innerWidth >= 600 ? -4 : 0;

    setTooltipPosition({
      top: rect.bottom + window.scrollY + 8,
      left: (window.innerWidth - tooltipWidth) / 2 + scrollbarOffset,
    });
    setSelectedSpot(spot);
  };

  if (loading) {
    return (
      <Container>
        <StateText>{t('courseDetail.attractions.loading')}</StateText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <StateText>{t('courseDetail.attractions.error')}</StateText>
      </Container>
    );
  }

  if (!attractions.length) {
    return (
      <Container>
        <StateText>{t('courseDetail.attractions.empty')}</StateText>
      </Container>
    );
  }

  return (
    <Container>
      {attractions.map(attractionData => (
        <div key={attractionData.courseId}>
          <AttractionItemGrid data-grid-container>
            {attractionData.spots.map((spot: SpotData) => (
              <AttractionItem key={spot.spotId} spot={spot} onMoreClick={handleMoreClick} />
            ))}
          </AttractionItemGrid>
        </div>
      ))}

      {selectedSpot && (
        <GlobalTooltip onClick={() => setSelectedSpot(null)}>
          <TooltipContent
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
            onClick={e => e.stopPropagation()}
          >
            <TooltipDescription>{selectedSpot.description}</TooltipDescription>
            <CloseButton onClick={() => setSelectedSpot(null)}>
              <img src={CloseIconSrc} alt="close" width={16} height={16} />
            </CloseButton>
          </TooltipContent>
        </GlobalTooltip>
      )}
    </Container>
  );
};

export default AttractionTab;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
  padding: var(--spacing-24) var(--spacing-16) var(--spacing-40);
`;

const AttractionItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-12);
  position: relative;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StateText = styled.div`
  text-align: center;
  padding: var(--spacing-24);
  color: var(--text-text-secondary);
  white-space: pre-line;
`;

const GlobalTooltip = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

const TooltipContent = styled.div`
  position: absolute;
  width: min(568px, calc(100vw - 32px));
  border-radius: 8px;
  background: #fff;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  padding: var(--spacing-12);
`;

const CloseButton = styled.button`
  width: 16px;
  height: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: #f5f5f5;
  }
`;

const TooltipDescription = styled.p`
  ${theme.typography.caption3};
  color: var(--text-text-secondary, #555555);
`;

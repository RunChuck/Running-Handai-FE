import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import styled from '@emotion/styled';
import * as S from './Section.styled';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import type { CourseTabType, SpotData, SpotStatus } from '@/types/course';

import AttractionItem from '@/components/AttractionItem';
import AttractionDetailModal from '@/components/AttractionDetailModal';
import Button from '@/components/Button';
import ArrowIconSrc from '@/assets/icons/arrow-right-16px.svg';
import { theme } from '@/styles/theme';

interface AttractionSectionProps {
  onTabChange: (tabKey: CourseTabType) => void;
  spots: SpotData[];
  spotStatus: SpotStatus;
  loading: boolean;
  error: string | null;
}

const AttractionSection = ({ onTabChange, spots, spotStatus, loading, error }: AttractionSectionProps) => {
  const [t] = useTranslation();
  const { scrollContainerRef, handleMouseDown } = useHorizontalScroll();
  const [selectedSpot, setSelectedSpot] = useState<SpotData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAttractionDetail = () => {
    onTabChange('attractions');
  };

  const handleSpotDetailClick = (spot: SpotData) => {
    setSelectedSpot(spot);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSpot(null);
  };

  const getStatusMessage = () => {
    if (loading) return t('courseDetail.attractions.loading');
    if (error) return t('courseDetail.attractions.error');
    if (spotStatus === 'IN_PROGRESS') return t('courseDetail.attractions.inProgress');
    if (spotStatus === 'FAILED') return t('courseDetail.attractions.failed');
    if (spotStatus === 'NOT_APPLICABLE') return t('courseDetail.attractions.notApplicable');
    if (spotStatus === 'COMPLETED' && !spots.length) return t('courseDetail.attractions.empty');
    return null;
  };

  const statusMessage = getStatusMessage();

  if (statusMessage) {
    return (
      <S.SectionContainer>
        <S.ContentContainer>
          <S.SectionTitle>{t('attractions')}</S.SectionTitle>
          <StateText>{statusMessage}</StateText>
        </S.ContentContainer>
      </S.SectionContainer>
    );
  }

  return (
    <S.SectionContainer>
      <S.ContentContainer>
        <S.SectionTitle>{t('attractions')}</S.SectionTitle>
        <AttractionList ref={scrollContainerRef} onMouseDown={handleMouseDown}>
          {spots.map(spot => (
            <AttractionItem key={spot.spotId} spot={spot} onMoreClick={() => handleSpotDetailClick(spot)} />
          ))}
        </AttractionList>
      </S.ContentContainer>

      {spots.length > 0 && (
        <Button
          backgroundColor="var(--bg-background-primary, #fff)"
          border="1px solid var(--line-line-002, #e0e0e0)"
          borderRadius="24px"
          fullWidth
          customTypography={true}
          onClick={handleAttractionDetail}
        >
          <S.ButtonText>{t('courseDetail.moreAttractions')}</S.ButtonText>
          <img src={ArrowIconSrc} alt="arrow" />
        </Button>
      )}

      <AttractionDetailModal isOpen={isModalOpen} onClose={handleModalClose} spot={selectedSpot} />
    </S.SectionContainer>
  );
};

export default AttractionSection;

const AttractionList = styled.div`
  display: grid;
  gap: var(--spacing-12);
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 600px) {
    display: flex;
    justify-content: flex-start;
    margin: 0 calc(-1 * var(--spacing-16));
    padding: 0 var(--spacing-16);

    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    user-select: none;
    -webkit-user-select: none;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    > * {
      flex-shrink: 0;
      width: 152px;
    }
  }
`;

const StateText = styled.div`
  text-align: center;
  padding: var(--spacing-24);
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
  white-space: pre-line;
`;

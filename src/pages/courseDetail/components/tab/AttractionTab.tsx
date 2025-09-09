import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useAttractions } from '@/hooks/useAttractions';
import AttractionItem from '@/components/AttractionItem';
import AttractionDetailModal from '@/components/AttractionDetailModal';
import type { SpotData } from '@/types/course';

interface AttractionTabProps {
  courseId: number;
}

const AttractionTab = ({ courseId }: AttractionTabProps) => {
  const [t] = useTranslation();
  const { attractions, loading, error } = useAttractions(courseId);
  const [selectedSpot, setSelectedSpot] = useState<SpotData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreClick = (spot: SpotData) => {
    setSelectedSpot(spot);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSpot(null);
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

  if (!attractions.length || attractions[0]?.spotCount === 0) {
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
              <AttractionItem key={spot.spotId} spot={spot} onMoreClick={() => handleMoreClick(spot)} />
            ))}
          </AttractionItemGrid>
        </div>
      ))}

      <AttractionDetailModal isOpen={isModalOpen} onClose={handleModalClose} spot={selectedSpot} />
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

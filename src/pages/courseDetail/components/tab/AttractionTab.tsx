import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useAttractions } from '@/hooks/useAttractions';
import AttractionItem from '@/components/AttractionItem';
import type { SpotData } from '@/types/course';

interface AttractionTabProps {
  courseId: number;
}

const AttractionTab = ({ courseId }: AttractionTabProps) => {
  const [t] = useTranslation();
  const { attractions, loading, error } = useAttractions(courseId);

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
          <AttractionItemGrid>
            {attractionData.spots.map((spot: SpotData) => (
              <AttractionItem key={spot.spotId} spot={spot} />
            ))}
          </AttractionItemGrid>
        </div>
      ))}
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

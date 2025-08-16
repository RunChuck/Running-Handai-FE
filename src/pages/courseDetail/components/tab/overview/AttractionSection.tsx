import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import * as S from './Section.styled';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import type { CourseTabType, SpotData } from '@/types/course';

import AttractionItem from '@/components/AttractionItem';
import Button from '@/components/Button';
import ArrowIconSrc from '@/assets/icons/arrow-right-16px.svg';

interface AttractionSectionProps {
  onTabChange: (tabKey: CourseTabType) => void;
  spots: SpotData[];
  loading: boolean;
  error: string | null;
}

const AttractionSection = ({ onTabChange, spots, loading, error }: AttractionSectionProps) => {
  const [t] = useTranslation();
  const { scrollContainerRef, handleMouseDown } = useHorizontalScroll();

  const handleAttractionDetail = () => {
    onTabChange('attractions');
  };

  if (loading) {
    return (
      <S.SectionContainer>
        <S.ContentContainer>
          <S.SectionTitle>{t('attractions')}</S.SectionTitle>
          <StateText>{t('courseDetail.attractions.loading')}</StateText>
        </S.ContentContainer>
      </S.SectionContainer>
    );
  }

  if (error) {
    return (
      <S.SectionContainer>
        <S.ContentContainer>
          <S.SectionTitle>{t('attractions')}</S.SectionTitle>
          <StateText>{t('courseDetail.attractions.error')}</StateText>
        </S.ContentContainer>
      </S.SectionContainer>
    );
  }

  if (!spots.length) {
    return (
      <S.SectionContainer>
        <S.ContentContainer>
          <S.SectionTitle>{t('attractions')}</S.SectionTitle>
          <StateText>{t('courseDetail.attractions.empty')}</StateText>
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
            <AttractionItem key={spot.spotId} spot={spot} hideMoreButton />
          ))}
        </AttractionList>
      </S.ContentContainer>

      {spots.length > 2 && (
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
    touch-action: pan-x;
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
  color: var(--text-text-secondary);
  white-space: pre-line;
`;

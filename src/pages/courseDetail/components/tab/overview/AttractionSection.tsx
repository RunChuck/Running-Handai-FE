import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import * as S from './Section.styled';
import type { CourseTabType } from '@/types/course';

import AttractionItem from '@/components/AttractionItem';
import Button from '@/components/Button';
import ArrowIconSrc from '@/assets/icons/arrow-right-16px.svg';

interface AttractionSectionProps {
  onTabChange: (tabKey: CourseTabType) => void;
}

const AttractionSection = ({ onTabChange }: AttractionSectionProps) => {
  const [t] = useTranslation();

  const handleAttractionDetail = () => {
    onTabChange('attractions');
  };

  return (
    <S.SectionContainer>
      <S.ContentContainer>
        <S.SectionTitle>{t('attractions')}</S.SectionTitle>
        <AttractionList>
          <AttractionItem />
          <AttractionItem />
          <AttractionItem />
        </AttractionList>
      </S.ContentContainer>
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
    </S.SectionContainer>
  );
};

export default AttractionSection;

const AttractionList = styled.div`
  display: flex;
  gap: var(--spacing-12);
`;

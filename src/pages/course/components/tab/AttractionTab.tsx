import styled from '@emotion/styled';

import AttractionItem from '../../../../components/AttractionItem';

const AttractionTab = () => {
  return (
    <Container>
      <AttractionItemGrid>
        <AttractionItem />
        <AttractionItem />
        <AttractionItem />
        <AttractionItem />
      </AttractionItemGrid>
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
`;

import { Sheet } from 'react-modal-sheet';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { ReactNode } from 'react';

import PenIconSrc from '@/assets/icons/pen-24px.svg';

interface BottomSheetProps {
  children: ReactNode;
  title?: string;
}

const snapPoints = [window.innerHeight * 0.9, window.innerHeight * 0.6, 32]; // max, default, min
const initialSnap = 1; // 60%

const BottomSheet = ({ children, title = '추천 코스' }: BottomSheetProps) => {
  const isOpen = true;

  return (
    <Sheet
      isOpen={isOpen}
      onClose={() => {}}
      snapPoints={snapPoints}
      initialSnap={initialSnap}
      disableDrag={false}
      mountPoint={document.body}
    >
      <Container>
        <Sheet.Header>
          <Header>
            <DragHandle />
          </Header>
        </Sheet.Header>

        <Sheet.Content>
          <TitleWrapper>
            <div />
            <Title>{title}</Title>
            <PenButton>
              <img src={PenIconSrc} alt="코스 등록" width={20} height={20} />
            </PenButton>
          </TitleWrapper>
          <Sheet.Scroller autoPadding draggableAt="both">
            <Content>{children}</Content>
          </Sheet.Scroller>
        </Sheet.Content>
      </Container>
    </Sheet>
  );
};

export default BottomSheet;

const Container = styled(Sheet.Container)`
  max-width: 600px;
  margin: 0 auto;
  left: 0;
  right: 0;

  &.react-modal-sheet-container {
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
    box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.08) !important;
  }
`;

const Header = styled.div`
  padding: var(--spacing-12) var(--spacing-24);
  background: var(--surface-surface-default);
  border-radius: 16px 16px 0 0;
  min-height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DragHandle = styled.div`
  width: 40px;
  height: 6px;
  background: var(--GrayScale-gray300);
  border-radius: 50px;
  transition: background-color 0.2s ease;
  &:hover {
    background: var(--GrayScale-gray400);
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-16);
`;

const Title = styled.h2`
  ${theme.typography.subtitle1}
  color: var(--text-text-title);
  margin: 0;
`;

const PenButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const Content = styled.div`
  padding: var(--spacing-24) var(--spacing-16) var(--spacing-16) var(--spacing-16);
  background: var(--surface-surface-default);
  min-height: 300px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--GrayScale-gray300);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--GrayScale-gray400);
  }
`;

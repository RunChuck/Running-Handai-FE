import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import { Sheet, type SheetRef } from 'react-modal-sheet';
import PenIconSrc from '@/assets/icons/pen-24px.svg';

interface BottomSheetProps {
  children: ReactNode;
  titleData?: {
    prefix: string;
    suffix: string;
    isFiltered: boolean;
  };
  floatButtons?: ReactNode;
}

export interface BottomSheetRef {
  snapTo: (index: number) => void;
}

const snapPoints = [window.innerHeight * 0.9, window.innerHeight * 0.6, 32]; // max, default, min
const initialSnap = 1; // 60%

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(({ children, titleData, floatButtons }, ref) => {
  const [t] = useTranslation();
  const isOpen = true;
  const sheetRef = useRef<SheetRef>(null);

  const defaultTitleData = {
    prefix: '',
    suffix: t('recommendedCourses'),
    isFiltered: false,
  };

  const finalTitleData = titleData || defaultTitleData;

  useImperativeHandle(ref, () => ({
    snapTo: (index: number) => {
      sheetRef.current?.snapTo(index);
    },
  }));

  return (
    <Sheet
      ref={sheetRef}
      isOpen={isOpen}
      onClose={() => {}}
      snapPoints={snapPoints}
      initialSnap={initialSnap}
      disableDrag={false}
      mountPoint={document.body}
    >
      <Container>
        {floatButtons && <FloatButtonWrapper>{floatButtons}</FloatButtonWrapper>}

        <Sheet.Header>
          <Header>
            <DragHandle />
          </Header>
        </Sheet.Header>

        <Sheet.Content>
          <TitleWrapper>
            <div />
            <Title>
              {finalTitleData.prefix && <FilterText>{finalTitleData.prefix}&nbsp;</FilterText>}
              <BaseText>{finalTitleData.suffix}</BaseText>
            </Title>
            <PenButton>
              <img src={PenIconSrc} alt="코스 등록" width={20} height={20} />
            </PenButton>
          </TitleWrapper>
          <Content>{children}</Content>
        </Sheet.Content>
      </Container>
    </Sheet>
  );
});

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;

const Container = styled(Sheet.Container)`
  max-width: 600px;
  margin: 0 auto;
  left: 0;
  right: 0;
  position: relative;

  &.react-modal-sheet-container {
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
    box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.08) !important;
  }
`;

const FloatButtonWrapper = styled.div`
  position: absolute;
  top: -16px;
  left: 0;
  right: 0;
  z-index: 10;
  pointer-events: none; /* 컨테이너는 클릭 X */

  & > * {
    pointer-events: auto;
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
  margin: 0;
  display: flex;
  align-items: center;
`;

const FilterText = styled.span`
  color: var(--primary-primary, #4561ff);
`;

const BaseText = styled.span`
  color: var(--text-text-title, #1c1c1c);
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

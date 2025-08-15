import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { motion, useAnimation } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

import PenIconSrc from '@/assets/icons/pen-24px.svg';

interface BottomSheetProps {
  children: ReactNode;
  titleData?: {
    prefix: string;
    suffix: string;
    isFiltered: boolean;
  };
  floatButtons?: ReactNode;
  onHeightChange?: (height: number) => void;
  showAnimation?: boolean;
}

export interface BottomSheetRef {
  snapTo: (index: number) => void;
}

const SNAP_HEIGHTS = [0.9, 0.6, 42 / window.innerHeight]; // 90%, 60%, 42px
const INITIAL_SNAP = 1; // 60%

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ children, titleData, floatButtons, onHeightChange, showAnimation = false }, ref) => {
    const [t] = useTranslation();
    const [currentSnap, setCurrentSnap] = useState(INITIAL_SNAP);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const controls = useAnimation();
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // 터치 이벤트 처리를 위한 useEffect 추가
    useEffect(() => {
      const preventScroll = (e: TouchEvent) => {
        if (isDragging && e.cancelable) {
          e.preventDefault();
        }
      };

      // 터치무브 이벤트에 대한 기본 동작 방지
      document.body.addEventListener('touchmove', preventScroll, { passive: false });

      return () => {
        document.body.removeEventListener('touchmove', preventScroll);
      };
    }, [isDragging]);

    // 드래그 시작 시 body에 overflow hidden 적용
    useEffect(() => {
      if (isDragging) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }, [isDragging]);

    const defaultTitleData = {
      prefix: '',
      suffix: t('recommendedCourses'),
      isFiltered: false,
    };

    const finalTitleData = titleData || defaultTitleData;

    // 뷰포트 높이 변경 감지
    useEffect(() => {
      const handleResize = () => {
        setViewportHeight(window.innerHeight);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 스냅 포인트로 이동
    const snapTo = (snapIndex: number) => {
      if (snapIndex < 0 || snapIndex >= SNAP_HEIGHTS.length) return;

      const targetHeight = viewportHeight * SNAP_HEIGHTS[snapIndex];
      setCurrentSnap(snapIndex);

      // 애니메이션 시작 전에 즉시 높이 변경 알림
      onHeightChange?.(targetHeight);

      controls.start({
        height: targetHeight,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 300,
          mass: 0.5,
        },
      });
    };

    // 가장 가까운 스냅 포인트 찾기
    const findClosestSnap = (currentHeight: number, velocity: number = 0) => {
      const currentRatio = currentHeight / viewportHeight;

      // 드래그 민감도 향상
      const VELOCITY_THRESHOLD = 50; // 속도 임계값
      const DRAG_THRESHOLD = 0.1; // 드래그 거리 임계값 (뷰포트 높이의 10%)

      if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
        if (velocity > 0 && currentSnap < SNAP_HEIGHTS.length - 1) {
          return currentSnap + 1;
        } else if (velocity < 0 && currentSnap > 0) {
          return currentSnap - 1;
        }
      }

      // 현재 스냅 포인트와의 거리 계산
      const currentSnapHeight = SNAP_HEIGHTS[currentSnap];
      const distanceFromCurrentSnap = Math.abs(currentRatio - currentSnapHeight);

      if (distanceFromCurrentSnap > DRAG_THRESHOLD) {
        if (currentRatio > currentSnapHeight && currentSnap < SNAP_HEIGHTS.length - 1) {
          return currentSnap + 1;
        }
        if (currentRatio < currentSnapHeight && currentSnap > 0) {
          return currentSnap - 1;
        }
      }

      let closestSnap = 0;
      let minDistance = Math.abs(SNAP_HEIGHTS[0] - currentRatio);

      for (let i = 1; i < SNAP_HEIGHTS.length; i++) {
        const distance = Math.abs(SNAP_HEIGHTS[i] - currentRatio);
        if (distance < minDistance) {
          minDistance = distance;
          closestSnap = i;
        }
      }

      return closestSnap;
    };

    // 드래그 시작
    const handleDragStart = () => {
      setIsDragging(true);
    };

    // 드래그 중
    const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!sheetRef.current) return;

      const sheetElement = sheetRef.current;
      const currentHeight = sheetElement.offsetHeight;
      const deltaY = info.delta.y * 1.5; // 드래그 반응성 향상

      // 새로운 높이 계산 (드래그 방향과 높이 변화 반대)
      const newHeight = Math.max(
        42, // 최소 높이 42px로 고정
        Math.min(
          viewportHeight * 0.9, // 최대 높이
          currentHeight - deltaY // 위로 드래그하면 높이 증가, 아래로 드래그하면 높이 감소
        )
      );

      // 즉시 높이 적용
      controls.set({ height: newHeight });

      // 드래그 중 실시간 높이 변경 알림
      onHeightChange?.(newHeight);
    };

    // 드래그 종료
    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);

      if (!sheetRef.current) return;

      const currentHeight = sheetRef.current.offsetHeight;
      const newSnap = findClosestSnap(currentHeight, info.velocity.y);
      snapTo(newSnap);
    };

    useImperativeHandle(ref, () => ({
      snapTo,
    }));

    // 초기 위치 설정
    useEffect(() => {
      if (viewportHeight > 0) {
        snapTo(INITIAL_SNAP);
      }
    }, [viewportHeight]);

    return (
      <>
        <SheetContainer
          ref={sheetRef}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={{ height: viewportHeight * SNAP_HEIGHTS[INITIAL_SNAP] }}
          isDragging={isDragging}
        >
          {floatButtons && <FloatButtonWrapper>{floatButtons}</FloatButtonWrapper>}

          <SheetContent>
            <DragArea>
              <DragHandle />
            </DragArea>
            <ContentArea>
              <TitleWrapper>
                <div style={{ width: '28px' }} />
                <Title>
                  {finalTitleData.prefix && <FilterText>{finalTitleData.prefix}&nbsp;</FilterText>}
                  <BaseText>{finalTitleData.suffix}</BaseText>
                </Title>
                <PenButton showAnimation={showAnimation}>
                  <img src={PenIconSrc} alt="코스 등록" width={20} height={20} />
                </PenButton>
              </TitleWrapper>

              <ScrollableContent>{children}</ScrollableContent>
            </ContentArea>
          </SheetContent>
        </SheetContainer>
      </>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;

const FloatButtonWrapper = styled.div`
  position: absolute;
  top: -16px;
  left: 0;
  right: 0;
  z-index: 10;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

const SheetContainer = styled(motion.div)<{ isDragging: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  max-width: 600px;
  margin: 0 auto;

  /* 하드웨어 가속 */
  transform: translateZ(0);
  will-change: transform;

  cursor: ${props => (props.isDragging ? 'grabbing' : 'auto')};

  /* 터치 동작 제어 */
  touch-action: none;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  /* PWA - 홈 인디케이터 영역 고려 */
  @media (display-mode: standalone) {
    padding-bottom: env(safe-area-inset-bottom);

    @supports (padding: max(0px)) {
      padding-bottom: max(env(safe-area-inset-bottom), 0px);
    }
  }
`;

const SheetContent = styled.div`
  background: var(--surface-surface-default);
  border-radius: 16px 16px 0 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.12);
  overflow: hidden;
`;

const DragArea = styled.div`
  padding: var(--spacing-12) var(--spacing-24) var(--spacing-24);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  touch-action: pan-y;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  flex-shrink: 0;

  /* 드래그 영역 확대 */
  min-height: 48px;

  &:active {
    cursor: grabbing;
  }
`;

const DragHandle = styled.div`
  width: 40px;
  height: 6px;
  background: var(--GrayScale-gray300);
  border-radius: 50px;
  transition: background-color 0.2s ease;

  ${DragArea}:hover & {
    background: var(--GrayScale-gray400);
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: visible;
  min-height: 0;
  gap: var(--spacing-24);
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-16);
  flex-shrink: 0;
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

const PenButton = styled.button<{ showAnimation: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-4);
  border-radius: 4px;
  transition: background-color 0.2s ease;
  position: relative;

  &:hover {
    background: var(--surface-surface-highlight);
  }

  ${({ showAnimation }) =>
    showAnimation &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 28px;
      height: 28px;
      background: rgba(69, 97, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: Pulse 2s ease-out infinite;
      pointer-events: none;
      z-index: 1;
    }

    @keyframes Pulse {
      0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.6;
      }
      70% {
        transform: translate(-50%, -50%) scale(1.3);
        opacity: 0.2;
      }
      100% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0;
      }
    }
  `}
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 var(--spacing-16) var(--spacing-40);
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  min-height: 0;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import Button from './Button';

import CommonInput from './CommonInput';
import MapThumbnailCapture, { type MapThumbnailCaptureRef } from './MapThumbnailCapture';
import CloseIconSrc from '@/assets/icons/close-24px.svg';
import ZoomIconSrc from '@/assets/icons/zoomIn-24px.svg';

type CourseCreationModalMode = 'create' | 'edit';

interface CourseCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startPoint: string, endPoint: string) => void;
  confirmText: string;
  mode?: CourseCreationModalMode;
  initialStartPoint?: string;
  initialEndPoint?: string;
  routeCoordinates?: { lat: number; lng: number }[];
}

const CourseCreationModal = ({
  isOpen,
  onClose,
  onConfirm,
  confirmText,
  mode = 'create',
  initialStartPoint = '',
  initialEndPoint = '',
  routeCoordinates = [],
}: CourseCreationModalProps) => {
  const [t] = useTranslation();
  const [startPoint, setStartPoint] = useState(initialStartPoint);
  const [endPoint, setEndPoint] = useState(initialEndPoint);
  const [zoomLevel, setZoomLevel] = useState(5); // 카카오맵 줌 레벨 (1-14)
  const thumbnailMapRef = useRef<MapThumbnailCaptureRef>(null);

  const handleConfirm = () => {
    onConfirm(startPoint, endPoint);
  };

  const handleZoomChange = (newZoomLevel: number) => {
    setZoomLevel(newZoomLevel);
  };

  const handleZoomSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoomLevel = 15 - Number(e.target.value);
    setZoomLevel(newZoomLevel);
    thumbnailMapRef.current?.setZoom(newZoomLevel);
  };

  const isStartPointValid = startPoint.length > 0 && startPoint.length <= 20;
  const isEndPointValid = endPoint.length > 0 && endPoint.length <= 20;
  const isButtonDisabled = !isStartPointValid || !isEndPointValid;

  // 모달이 열릴 때 썸네일 맵 업데이트
  useEffect(() => {
    if (isOpen && routeCoordinates.length > 0) {
      thumbnailMapRef.current?.updateRoute(routeCoordinates);
    }
  }, [isOpen, routeCoordinates]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <img src={CloseIconSrc} alt="close" />
        </CloseButton>
        <Title>{mode === 'create' ? t('modal.courseCreation.create.title') : t('modal.courseCreation.edit.title')}</Title>

        <InputRow>
          <InputWrapper>
            <InputLabel>{t('modal.courseCreation.startPoint')}</InputLabel>
            <CommonInput
              type="text"
              value={startPoint}
              onChange={setStartPoint}
              placeholder={t('modal.courseCreation.startPointPlaceholder')}
              state={startPoint.length > 20 ? 'negative' : 'default'}
              validationText={startPoint.length > 20 ? t('modal.courseCreation.PointValidation') : undefined}
            />
          </InputWrapper>
          <InputWrapper>
            <InputLabel>{t('modal.courseCreation.endPoint')}</InputLabel>
            <CommonInput
              type="text"
              value={endPoint}
              onChange={setEndPoint}
              placeholder={t('modal.courseCreation.endPointPlaceholder')}
              state={endPoint.length > 20 ? 'negative' : 'default'}
              validationText={endPoint.length > 20 ? t('modal.courseCreation.PointValidation') : undefined}
            />
          </InputWrapper>
        </InputRow>

        <ThumbnailSection>
          <SectionTitle>{t('modal.courseCreation.thumbnail')}</SectionTitle>
          <MapPreview>
            <MapThumbnailCapture ref={thumbnailMapRef} coordinates={routeCoordinates} zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />
          </MapPreview>
          <ZoomControls>
            <ZoomLabel>
              <img src={ZoomIconSrc} alt="zoom" />
              {t('modal.courseCreation.zoom')}
            </ZoomLabel>
            <ZoomSlider type="range" min="1" max="14" value={15 - zoomLevel} onChange={handleZoomSliderChange} />
          </ZoomControls>
        </ThumbnailSection>

        <Button variant="primary" fullWidth disabled={isButtonDisabled} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </ModalContainer>
    </Overlay>
  );
};

export default CourseCreationModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(1.5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
`;

const ModalContainer = styled.div`
  width: calc(100% - 32px);
  max-width: 568px;
  // TODO: 추후 UI 나오면 수정 필요
  // min-height: 487px;
  background: var(--surface-surface-default, #ffffff);
  border-radius: 16px;
  padding: var(--spacing-32) var(--spacing-16) var(--spacing-16);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  animation: fadeIn 0.3s ease-out;
  position: relative;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;

  &:hover {
    background: var(--surface-surface-highlight, #f4f4f4);
    border-radius: 4px;
  }
`;

const Title = styled.div`
  ${theme.typography.subtitle2}
  color: var(--text-text-title, #1c1c1c);
  text-align: center;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;

  & > * {
    flex: 1;
    min-width: 0;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InputLabel = styled.div`
  ${theme.typography.body2}
`;

const ThumbnailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.div`
  ${theme.typography.subtitle2}
  color: var(--text-text-title, #1c1c1c);
  text-align: center;
`;

const MapPreview = styled.div`
  width: 100%;
  height: 300px;
  width: 300px;
  border: 1px solid var(--line-line-001, #eee);
  background: var(--surface-surface-highlight3, #f7f8fa);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-16);
`;

const ZoomLabel = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-title, #1c1c1c);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ZoomSlider = styled.input`
  flex: 1;
  height: 4px;
  background: var(--line-line-001, #eee);
  border-radius: 8px;
  outline: none;
  appearance: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: var(--primary-primary, #4261ff);
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 8px;
    height: 8px;
    background: var(--primary-primary, #4261ff);
    border-radius: 50%;
    cursor: pointer;
  }
`;

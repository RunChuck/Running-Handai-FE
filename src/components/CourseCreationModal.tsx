import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import Button from './Button';

import CommonInput from './CommonInput';
import MapThumbnailCapture, { type MapThumbnailCaptureRef } from './MapThumbnailCapture';
import CloseIconSrc from '@/assets/icons/close-24px.svg';
import UploadIconSrc from '@/assets/icons/zoomIn-24px.svg';

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
  confirmText: _confirmText,
  mode: _mode = 'create',
  initialStartPoint = '',
  initialEndPoint = '',
  routeCoordinates = [],
}: CourseCreationModalProps) => {
  const [t] = useTranslation();
  const [startPoint, setStartPoint] = useState(initialStartPoint);
  const [endPoint, setEndPoint] = useState(initialEndPoint);
  const [zoomLevel, setZoomLevel] = useState(5); // 카카오맵 줌 레벨 (1-14)
  const thumbnailMapRef = useRef<MapThumbnailCaptureRef>(null);

  // 모달 단계 상태
  const [currentStep, setCurrentStep] = useState<'preview' | 'upload'>('preview');

  // 이미지 업로드 및 크롭 상태
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 확대/축소 및 드래그 상태
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleConfirm = () => {
    onConfirm(startPoint, endPoint);
  };

  const handleNextStep = () => {
    setCurrentStep('upload');
  };

  const handleBackToPreview = () => {
    setCurrentStep('preview');
    setSelectedImage(null);
    setCroppedImageBlob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleZoomChange = (newZoomLevel: number) => {
    setZoomLevel(newZoomLevel);
  };

  const handleZoomSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoomLevel = 15 - Number(e.target.value);
    setZoomLevel(newZoomLevel);
    thumbnailMapRef.current?.setZoom(newZoomLevel);
  };

  // 이미지 파일 선택 핸들러
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setCroppedImageBlob(null); // 새 이미지 선택시 기존 크롭 결과 초기화
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 로드 완료 핸들러
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;

    // cover 방식: 컨테이너를 완전히 덮도록 스케일 설정
    const containerSize = 300;
    const scaleX = containerSize / naturalWidth;
    const scaleY = containerSize / naturalHeight;

    const coverScale = Math.max(scaleX, scaleY);

    setImageScale(coverScale);
    setImagePosition({ x: 0, y: 0 });

    // 초기 크롭 실행
    setTimeout(() => cropCurrentView(), 100);
  };

  // 현재 뷰포트의 이미지를 크롭
  const cropCurrentView = () => {
    if (!imgRef.current || !imageContainerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 300x300 크기로 고정
    canvas.width = 300;
    canvas.height = 300;

    const img = imgRef.current;
    const container = imageContainerRef.current;

    // 이미지의 실제 DOM 위치 정보 가져오기
    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // 컨테이너 기준 상대 위치 계산
    const relativeX = imgRect.left - containerRect.left;
    const relativeY = imgRect.top - containerRect.top;

    // 컨테이너 크기에 맞게 스케일 계산
    const scaleX = 300 / containerRect.width;
    const scaleY = 300 / containerRect.height;

    // 캔버스에 이미지 그리기
    ctx.drawImage(img, relativeX * scaleX, relativeY * scaleY, imgRect.width * scaleX, imgRect.height * scaleY);

    canvas.toBlob(blob => {
      if (blob) {
        setCroppedImageBlob(blob);
      }
    }, 'image/png');
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageReset = () => {
    setSelectedImage(null);
    setCroppedImageBlob(null);
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 확대/축소 핸들러
  const handleZoom = (delta: number) => {
    setImageScale(prev => {
      if (!imgRef.current) return prev;

      const { naturalWidth, naturalHeight } = imgRef.current;
      const containerSize = 300;
      const scaleX = containerSize / naturalWidth;
      const scaleY = containerSize / naturalHeight;
      const minScale = Math.max(scaleX, scaleY);

      const newScale = Math.max(minScale, Math.min(3, prev + delta));
      // 스케일 변경 후 크롭 업데이트
      setTimeout(() => cropCurrentView(), 50);
      return newScale;
    });
  };

  // 마우스 휠로 확대/축소
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(delta);
  };

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  // 드래그 중
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setImagePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  // 드래그 종료
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // 드래그 완료 후 크롭 업데이트
      setTimeout(() => cropCurrentView(), 50);
    }
  };

  // 이미지 위치 초기화
  const handleResetPosition = () => {
    if (!imgRef.current) return;

    const { naturalWidth, naturalHeight } = imgRef.current;
    const containerSize = 300;
    const scaleX = containerSize / naturalWidth;
    const scaleY = containerSize / naturalHeight;
    const coverScale = Math.max(scaleX, scaleY);

    setImageScale(coverScale);
    setImagePosition({ x: 0, y: 0 });
    // 리셋 후 크롭 업데이트
    setTimeout(() => cropCurrentView(), 50);
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

        {/* 단계 표시 */}
        <StepIndicator>
          <StepDot active={currentStep === 'preview'}>1</StepDot>
          <StepLine active={currentStep === 'upload'} />
          <StepDot active={currentStep === 'upload'}>2</StepDot>
        </StepIndicator>

        {currentStep === 'preview' ? (
          // 1단계: 코스 정보 입력 및 미리보기
          <>
            <Title>코스 정보 입력</Title>

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
              <SectionTitle>썸네일 미리보기</SectionTitle>
              <StepGuide>
                <p>📸 지도를 원하는 크기로 조정한 후</p>
                <p>스크린샷을 찍어서 다음 단계로 진행해주세요</p>
              </StepGuide>
              <MapPreview>
                <MapThumbnailCapture ref={thumbnailMapRef} coordinates={routeCoordinates} zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />
              </MapPreview>
              <ZoomControls>
                <ZoomLabel>
                  <img src={UploadIconSrc} alt="zoom" />
                  확대
                </ZoomLabel>
                <ZoomSlider type="range" min="1" max="14" value={15 - zoomLevel} onChange={handleZoomSliderChange} />
              </ZoomControls>
            </ThumbnailSection>

            <Button variant="primary" fullWidth disabled={isButtonDisabled} onClick={handleNextStep}>
              다음
            </Button>
          </>
        ) : (
          // 2단계: 스크린샷 업로드 및 크롭
          <>
            <ThumbnailSection>
              <SectionTitle>썸네일 등록</SectionTitle>

              {!selectedImage ? (
                <UploadArea>
                  <UploadGuide>
                    <p>방금 조정한 스크린샷을 업로드해주세요</p>
                  </UploadGuide>
                  <UploadButton onClick={handleImageUploadClick}>스크린샷 업로드</UploadButton>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
                </UploadArea>
              ) : (
                <CropArea>
                  <CropGuide>썸네일 영역을 선택해주세요</CropGuide>
                  <ImageContainer
                    ref={imageContainerRef}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <CropImage
                      ref={imgRef}
                      src={selectedImage}
                      onLoad={onImageLoad}
                      alt="Crop preview"
                      style={{
                        transform: `translate(-50%, -50%) scale(${imageScale}) translate(${imagePosition.x / imageScale}px, ${imagePosition.y / imageScale}px)`,
                        cursor: isDragging ? 'grabbing' : 'grab',
                      }}
                    />
                  </ImageContainer>

                  <ImageControls>
                    <ControlButton onClick={() => handleZoom(0.1)}>확대 (+)</ControlButton>
                    <ControlButton onClick={() => handleZoom(-0.1)}>축소 (-)</ControlButton>
                    <ControlButton onClick={handleResetPosition}>초기화</ControlButton>
                    {/* <ControlButton onClick={handleDownloadCroppedImage} disabled={!croppedImageBlob}>
                      다운로드
                    </ControlButton> */}
                  </ImageControls>
                  <CropControls>
                    <ResetButton onClick={handleImageReset}>다시 선택</ResetButton>
                  </CropControls>
                </CropArea>
              )}
            </ThumbnailSection>
            <WarningGuide>* 적절하지 않은 이미지 업로드시 코스가 삭제될 수 있습니다.</WarningGuide>

            <ButtonRow>
              <Button variant="secondary" onClick={handleBackToPreview}>
                이전
              </Button>
              <Button variant="primary" disabled={!croppedImageBlob} onClick={handleConfirm}>
                완료
              </Button>
            </ButtonRow>
          </>
        )}
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

  @media (max-width: 600px) {
    height: 487px;
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
  gap: 8px;
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

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  gap: 8px;
`;

const StepDot = styled.div<{ active: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${theme.typography.body2}
  font-weight: 600;
  background: ${props => (props.active ? 'var(--primary-primary, #4261ff)' : 'var(--surface-surface-highlight, #f4f4f4)')};
  color: ${props => (props.active ? 'white' : 'var(--text-text-subtitle, #666)')};
  transition: all 0.3s ease;
`;

const StepLine = styled.div<{ active: boolean }>`
  width: 40px;
  height: 2px;
  background: ${props => (props.active ? 'var(--primary-primary, #4261ff)' : 'var(--line-line-001, #eee)')};
  transition: all 0.3s ease;
`;

const StepGuide = styled.div`
  text-align: center;
  padding: 8px;
  background: var(--surface-surface-highlight3, #f7f8fa);
  border-radius: 8px;
  border: 1px solid var(--line-line-001, #eee);

  p {
    ${theme.typography.body2}
    color: var(--text-text-subtitle, #666);
    margin: 2px 0;
  }
`;

const CropGuide = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-subtitle, #666);
  text-align: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;

  & > button {
    flex: 1;
  }
`;

const UploadArea = styled.div`
  width: 300px;
  height: 300px;
  border: 2px dashed var(--line-line-001, #eee);
  border-radius: 8px;
  background: var(--surface-surface-highlight3, #f7f8fa);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const UploadGuide = styled.div`
  text-align: center;

  p {
    ${theme.typography.body2}
    color: var(--text-text-subtitle, #666);
    margin: 4px 0;
  }
`;

const UploadButton = styled.button`
  ${theme.typography.body1}
  background: var(--primary-primary, #4261ff);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary-primary002, #2845e9);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const CropArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const ImageContainer = styled.div`
  width: 300px;
  height: 300px;
  border: 2px solid var(--line-line-001, #eee);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  user-select: none;
  background: #f9f9f9;
`;

const CropImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  transition: transform 0.1s ease;
  pointer-events: none;
  max-width: none;
  max-height: none;
`;

const ImageControls = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const ControlButton = styled.button<{ disabled?: boolean }>`
  ${theme.typography.caption1}
  color: ${props => (props.disabled ? 'var(--text-text-disable, #ccc)' : 'var(--primary-primary, #4261ff)')};
  background: transparent;
  border: 1px solid ${props => (props.disabled ? 'var(--line-line-001, #eee)' : 'var(--primary-primary, #4261ff)')};
  border-radius: 6px;
  padding: 6px 12px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--primary-primary, #4261ff);
    color: white;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const CropControls = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
`;

const ResetButton = styled.button`
  ${theme.typography.body2}
  color: var(--text-text-subtitle, #666);
  background: transparent;
  border: 1px solid var(--line-line-001, #eee);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--surface-surface-highlight, #f4f4f4);
  }
`;

const WarningGuide = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-subtitle, #666);
  text-align: center;
`;

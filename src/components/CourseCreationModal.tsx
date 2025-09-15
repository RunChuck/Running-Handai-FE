import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useCourseCreation } from '@/contexts/CourseCreationContext';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useToast } from '@/hooks/useToast';

import MapThumbnailCapture, { type MapThumbnailCaptureRef } from './MapThumbnailCapture';
import CommonInput from './CommonInput';
import Button from './Button';
import CloseIconSrc from '@/assets/icons/close-24px.svg';
import UploadIconSrc from '@/assets/icons/upload.svg';
import ZoomInIconSrc from '@/assets/icons/zoomIn-24px.svg';
import ZoomOutIconSrc from '@/assets/icons/zoom-out.svg';
import ResetIconSrc from '@/assets/icons/reset.svg';
import InfoIconSrc from '@/assets/icons/info-primary.svg';

interface CourseCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (courseData: { startPoint: string; endPoint: string; thumbnailBlob: Blob; isInBusan: boolean }) => void;
  confirmText: string;
  initialStartPoint?: string;
  initialEndPoint?: string;
  routeCoordinates?: { lat: number; lng: number }[];
  uploadedGpxFile?: File | null; // GPX 업로드 파일
  isGpxUploaded?: boolean; // GPX 업로드 여부
  gpxData?: { coordinates: { lat: number; lng: number }[] } | null; // GPX 데이터
}

const CourseCreationModal = ({
  isOpen,
  onClose,
  onConfirm,
  confirmText: _confirmText,
  routeCoordinates = [],
  isGpxUploaded = false,
  gpxData = null,
}: CourseCreationModalProps) => {
  const [t] = useTranslation();
  const [zoomLevel, setZoomLevel] = useState(5); // 카카오맵 줌 레벨 (1-14)
  const thumbnailMapRef = useRef<MapThumbnailCaptureRef>(null);

  // Context에서 상태 및 함수 가져오기
  const {
    isInBusan,
    hasCheckedLocation,
    handleCheckLocation,
    isLoading: contextLoading,
    startPoint,
    endPoint,
    setStartPoint,
    setEndPoint,
  } = useCourseCreation();

  const isMobile = useIsMobile();
  const { showErrorToast } = useToast();

  // 모달 단계 상태 (upload 단계 제거)
  const [currentStep, setCurrentStep] = useState<'courseInfo' | 'thumbnail'>('courseInfo');

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

  // 핀치 줌 상태
  const [isPinching, setIsPinching] = useState(false);
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);

  // 로딩 상태 (이미지 크롭 등)
  const [isLoading, setIsLoading] = useState(false);

  // 드래그 앤 드롭 상태
  const [isDragOver, setIsDragOver] = useState(false);

  const handleConfirm = async () => {
    if (!thumbnailMapRef.current) {
      showErrorToast('지도 썸네일을 생성할 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);

      // StaticMap 이미지 생성
      const thumbnailBlob = await thumbnailMapRef.current.generateStaticMap();
      if (!thumbnailBlob) {
        showErrorToast('썸네일 생성에 실패했습니다.');
        return;
      }

      // 최종 등록 진행
      onConfirm({
        startPoint,
        endPoint,
        thumbnailBlob,
        isInBusan: isInBusan || false,
      });
    } catch (error) {
      console.error('코스 등록 실패:', error);
      showErrorToast('코스 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 'courseInfo') {
      try {
        await handleCheckLocation();
        setCurrentStep('thumbnail');
      } catch (error) {
        console.error('부산 지역 체크 실패:', error);
        // 실패해도 다음 단계로 진행
        setCurrentStep('thumbnail');
      }
    }
    // thumbnail 단계에서는 바로 코스 등록 (upload 단계 제거)
  };

  const handlePrevStep = () => {
    if (currentStep === 'thumbnail') {
      setCurrentStep('courseInfo');
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

  // 이미지 파일 처리 공통 함수
  const processImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setCroppedImageBlob(null); // 새 이미지 선택시 기존 크롭 결과 초기화
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 파일 선택 핸들러
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // 드래그 앤 드롭 이벤트 핸들러
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 실제로 UploadArea를 벗어났을 때만 상태 변경
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      processImageFile(imageFile);
    }
  };

  // 클립보드에서 이미지 읽기 (버튼 클릭용)
  const handleClipboardPaste = async () => {
    if (currentStep !== 'upload' || selectedImage) return;

    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        console.log('클립보드 API를 지원하지 않는 브라우저입니다.');
        return;
      }

      const clipboardItems = await navigator.clipboard.read();

      for (const item of clipboardItems) {
        const imageTypes = item.types.filter(type => type.startsWith('image/'));

        if (imageTypes.length > 0) {
          const imageBlob = await item.getType(imageTypes[0]);
          const file = new File([imageBlob], 'clipboard-image.png', { type: imageTypes[0] });
          processImageFile(file);
          break;
        }
      }
    } catch {
      showErrorToast('클립보드에서 이미지를 읽을 수 없습니다.', { position: 'top' });
    }
  };

  // 두 터치 포인트 간 거리 계산
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // 이미지 로드 완료 핸들러
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;

    // cover 방식: 컨테이너를 완전히 덮도록 스케일 설정
    const containerSize = 311;
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

    // 622x622 고해상도 캔버스 생성 (311 * 2)
    canvas.width = 622;
    canvas.height = 622;

    const img = imgRef.current;
    const container = imageContainerRef.current;

    // 이미지의 실제 DOM 위치 정보 가져오기
    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // 컨테이너 기준 상대 위치 계산
    const relativeX = imgRect.left - containerRect.left;
    const relativeY = imgRect.top - containerRect.top;

    // 고해상도 캔버스용 스케일 계산 (2배)
    const scaleX = 622 / containerRect.width;
    const scaleY = 622 / containerRect.height;

    // 고해상도 캔버스에 이미지 그리기
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
    setIsPinching(false);
    setInitialDistance(0);
    setInitialScale(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 확대/축소 핸들러
  const handleZoom = (delta: number) => {
    setImageScale(prev => {
      if (!imgRef.current) return prev;

      const { naturalWidth, naturalHeight } = imgRef.current;
      const containerSize = 311;
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

  // 드래그 시작 (마우스)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  // 드래그 중 (마우스)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setImagePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  // 드래그 종료 (마우스)
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // 드래그 완료 후 크롭 업데이트
      setTimeout(() => cropCurrentView(), 50);
    }
  };

  // 터치 시작 (모바일)
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 1) {
      // 단일 터치 - 드래그 시작
      const touch = e.touches[0];
      setIsDragging(true);
      setIsPinching(false);
      setDragStart({
        x: touch.clientX - imagePosition.x,
        y: touch.clientY - imagePosition.y,
      });
    } else if (e.touches.length === 2) {
      // 두 손가락 터치 - 핀치 줌 시작
      setIsDragging(false);
      setIsPinching(true);
      const distance = getDistance(e.touches[0], e.touches[1]);
      setInitialDistance(distance);
      setInitialScale(imageScale);
    }
  };

  // 터치 중 (모바일)
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 1 && isDragging && !isPinching) {
      // 단일 터치 드래그
      const touch = e.touches[0];
      setImagePosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && isPinching) {
      // 핀치 줌
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scaleChange = currentDistance / initialDistance;
      const newScale = initialScale * scaleChange;

      if (!imgRef.current) return;

      const { naturalWidth, naturalHeight } = imgRef.current;
      const containerSize = 311;
      const scaleX = containerSize / naturalWidth;
      const scaleY = containerSize / naturalHeight;
      const minScale = Math.max(scaleX, scaleY);

      const clampedScale = Math.max(minScale, Math.min(3, newScale));
      setImageScale(clampedScale);
    }
  };

  // 터치 종료 (모바일)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      // 모든 터치 종료
      if (isDragging || isPinching) {
        setIsDragging(false);
        setIsPinching(false);
        // 조작 완료 후 크롭 업데이트
        setTimeout(() => cropCurrentView(), 100);
      }
    } else if (e.touches.length === 1 && isPinching) {
      // 핀치에서 드래그로 전환
      setIsPinching(false);
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - imagePosition.x,
        y: touch.clientY - imagePosition.y,
      });
    }
  };

  // 특수문자 및 공백 제거 함수 (한글, 영문, 숫자, ~, - 허용)
  const handlePointChange = (setter: (value: string) => void) => (value: string) => {
    const sanitized = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9~-]/g, '');
    setter(sanitized);
  };

  const isStartPointValid = startPoint.length >= 2 && startPoint.length <= 20;
  const isEndPointValid = endPoint.length >= 2 && endPoint.length <= 20;
  const isButtonDisabled = !isStartPointValid || !isEndPointValid;

  // 모달이 열릴 때 상태 초기화 및 썸네일 맵 업데이트
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때마다 1단계로 초기화
      setCurrentStep('courseInfo');
      setSelectedImage(null);
      setCroppedImageBlob(null);
      setImageScale(1);
      setImagePosition({ x: 0, y: 0 });
      setIsDragging(false);
      setIsPinching(false);
      setInitialDistance(0);
      setInitialScale(1);
      setIsLoading(false);

      // 파일 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // 썸네일 맵 업데이트
      const coordinates = isGpxUploaded && gpxData?.coordinates ? gpxData.coordinates : routeCoordinates;
      if (coordinates.length > 0) {
        thumbnailMapRef.current?.updateRoute(coordinates);
      }
    }
  }, [isOpen, routeCoordinates, gpxData, isGpxUploaded]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <img src={CloseIconSrc} alt="close" />
        </CloseButton>

        {currentStep === 'courseInfo' ? (
          // 1단계: 코스명 입력
          <>
            <Title>코스 정보 입력</Title>

            <InputContent>
              <InputWrapper>
                <InputLabel>{t('modal.courseCreation.startPoint')}</InputLabel>
                <CommonInput
                  type="text"
                  value={startPoint}
                  onChange={handlePointChange(setStartPoint)}
                  placeholder={t('modal.courseCreation.startPointPlaceholder')}
                  state={startPoint.length < 2 && startPoint.length > 0 ? 'negative' : startPoint.length > 20 ? 'negative' : 'default'}
                  validationText={
                    startPoint.length < 2 && startPoint.length > 0
                      ? '2글자 이상 입력해주세요'
                      : startPoint.length > 20
                        ? t('modal.courseCreation.PointValidation')
                        : undefined
                  }
                />
              </InputWrapper>
              <InputWrapper>
                <InputLabel>{t('modal.courseCreation.endPoint')}</InputLabel>
                <CommonInput
                  type="text"
                  value={endPoint}
                  onChange={handlePointChange(setEndPoint)}
                  placeholder={t('modal.courseCreation.endPointPlaceholder')}
                  state={endPoint.length < 2 && endPoint.length > 0 ? 'negative' : endPoint.length > 20 ? 'negative' : 'default'}
                  validationText={
                    endPoint.length < 2 && endPoint.length > 0
                      ? '2글자 이상 입력해주세요'
                      : endPoint.length > 20
                        ? t('modal.courseCreation.PointValidation')
                        : undefined
                  }
                />
              </InputWrapper>
            </InputContent>

            <Button variant="primary" fullWidth disabled={isButtonDisabled || contextLoading} onClick={handleNextStep}>
              {contextLoading ? '위치 확인 중...' : '다음'}
            </Button>
          </>
        ) : currentStep === 'thumbnail' ? (
          // 2단계: 썸네일 조정 및 미리보기
          <>
            <ThumbnailSection>
              <SectionTitleWrapper>
                <SectionTitle>썸네일 미리보기</SectionTitle>
                <StepGuide>지도를 확대 또는 축소하여{isMobile && <br />} 원하는 썸네일 크기로 조정한 후 캡쳐해주세요</StepGuide>
              </SectionTitleWrapper>

              {/* 부산 지역 체크 후 경고 메시지 */}
              {hasCheckedLocation && isInBusan === false && (
                <WarningMessage>
                  <WarningTitle>
                    <img src={InfoIconSrc} alt="info" width={16} height={16} />
                    현재 베타 버전이에요!
                  </WarningTitle>
                  부산 외 지역은 내 주변 5km 내에서만 추천 코스로 표시됩니다.
                </WarningMessage>
              )}
              <MapPreview>
                <MapThumbnailCapture ref={thumbnailMapRef} coordinates={routeCoordinates} zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />
              </MapPreview>
              <ZoomControls>
                <ZoomLabel>
                  <img src={ZoomInIconSrc} alt="zoom" />
                  확대
                </ZoomLabel>
                <ZoomSlider type="range" min="1" max="14" value={15 - zoomLevel} onChange={handleZoomSliderChange} />
              </ZoomControls>
            </ThumbnailSection>

            <ButtonRow>
              <Button variant="secondary" onClick={handlePrevStep}>
                이전
              </Button>
              <Button variant="primary" disabled={isLoading} onClick={handleConfirm}>
                {isLoading ? '등록 중...' : '코스 등록'}
              </Button>
            </ButtonRow>
          </>
        ) : (
          // 3단계: 스크린샷 업로드 및 크롭
          <>
            <ThumbnailSection>
              <SectionTitle>{!selectedImage ? '썸네일 업로드' : '썸네일 편집'}</SectionTitle>

              {!selectedImage ? (
                <UploadArea
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragOver={isDragOver}
                >
                  <UploadGuide>
                    <p>전 단계에서 캡쳐한 썸네일을 업로드 해주세요</p>
                    <strong>*부적절한 이미지 업로드 시 삭제될 수 있습니다.</strong>
                  </UploadGuide>
                  <UploadButton onClick={handleImageUploadClick}>
                    <img src={UploadIconSrc} alt="upload" />
                    썸네일 업로드
                  </UploadButton>
                  <ClipboardPasteText onClick={handleClipboardPaste}>클립보드에서 붙여넣기</ClipboardPasteText>
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
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <CropImage
                      ref={imgRef}
                      src={selectedImage}
                      onLoad={onImageLoad}
                      alt="Crop preview"
                      $isInteracting={isDragging || isPinching}
                      style={{
                        transform: `translate(-50%, -50%) scale(${imageScale}) translate(${imagePosition.x / imageScale}px, ${imagePosition.y / imageScale}px)`,
                        cursor: isDragging ? 'grabbing' : 'grab',
                      }}
                    />
                  </ImageContainer>

                  <ImageControls>
                    <ControlButton onClick={() => handleZoom(0.1)}>
                      <img src={ZoomInIconSrc} alt="zoom in" width={16} height={16} />
                      확대
                    </ControlButton>
                    <ControlButton onClick={() => handleZoom(-0.1)}>
                      <img src={ZoomOutIconSrc} alt="zoom out" width={16} height={16} />
                      축소
                    </ControlButton>
                    <ControlButton onClick={handleImageReset}>
                      <img src={ResetIconSrc} alt="reset" width={16} height={16} />
                      다시 선택
                    </ControlButton>
                  </ImageControls>
                </CropArea>
              )}
            </ThumbnailSection>

            <ButtonRow>
              <Button variant="secondary" onClick={handlePrevStep}>
                이전
              </Button>
              <Button variant="primary" disabled={!croppedImageBlob || isLoading} onClick={handleConfirm}>
                {isLoading ? '처리 중...' : '완료'}
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
  z-index: 100;
`;

const ModalContainer = styled.div`
  width: calc(100% - 32px);
  max-width: 568px;
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

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  width: 100%;
  gap: 8px;
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
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const SectionTitle = styled.div`
  ${theme.typography.subtitle2}
  color: var(--text-text-title, #1c1c1c);
  text-align: center;
`;

const MapPreview = styled.div`
  width: 100%;
  height: 311px;
  width: 311px;
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
  width: 100%;
  max-width: 300px;
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

const StepGuide = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555);
  text-align: center;

  @media (max-width: 600px) {
    ${theme.typography.label2}
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

const UploadArea = styled.div<{ isDragOver?: boolean }>`
  width: 311px;
  height: 311px;
  border: 2px dashed ${props => (props.isDragOver ? 'var(--primary-primary, #4261ff)' : 'var(--line-line-001, #eee)')};
  background: ${props => (props.isDragOver ? 'rgba(66, 97, 255, 0.05)' : 'var(--surface-surface-highlight3, #f7f8fa)')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s ease;
`;

const UploadGuide = styled.div`
  text-align: center;

  p {
    ${theme.typography.body2}
    color: var(--text-text-secondary, #555555);
  }

  strong {
    ${theme.typography.caption2}
    color: var(--text-text-secondary, #555555);
  }
`;

const UploadButton = styled.button`
  ${theme.typography.caption2}
  background: #ffffff;
  color: var(--GrayScale-gray500, #999);
  border: 1px solid var(--line-line-001, #eee);
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  height: 40px;

  &:hover {
    background: var(--surface-surface-highlight, #f4f4f4);
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
  margin-top: -4px;
`;

const ImageContainer = styled.div`
  width: 311px;
  height: 311px;
  border: 2px solid var(--line-line-001, #eee);
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  user-select: none;
  background: #f9f9f9;
`;

const CropImage = styled.img<{ $isInteracting?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  transition: ${props => (props.$isInteracting ? 'none' : 'transform 0.1s ease')};
  pointer-events: none;
  max-width: none;
  max-height: none;
  will-change: transform;
`;

const ImageControls = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 311px;
  justify-content: center;
  margin: 0 auto;
`;

const ControlButton = styled.button<{ disabled?: boolean }>`
  ${theme.typography.caption2}
  background: #ffffff;
  color: var(--GrayScale-gray500, #999);
  border: 1px solid var(--line-line-001, #eee);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  flex: 1;
  justify-content: center;

  &:hover {
    background: var(--surface-surface-highlight, #f4f4f4);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WarningMessage = styled.div`
  ${theme.typography.caption3}
  color: var(--text-text-secondary, #555555);
  background: var(--surface-surface-highlight3, #f7f8fa);
  padding: 8px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--line-line-001, #eee);
  width: 100%;
  max-width: 311px;

  strong {
    font-weight: 600;
    display: inline;
  }
`;

const WarningTitle = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  ${theme.typography.caption2}
  color: var(--text-text-title, #1c1c1c);
  margin-bottom: 4px;
`;

const ClipboardPasteText = styled.button`
  ${theme.typography.caption2}
  color: var(--text-text-secondary, #555555);
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  padding: 8px 0;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

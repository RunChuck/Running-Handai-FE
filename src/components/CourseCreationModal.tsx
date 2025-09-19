import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { useCourseCreation } from '@/contexts/CourseCreationContext';
import { useToast } from '@/hooks/useToast';

import MapThumbnailCapture, { type MapThumbnailCaptureRef } from './MapThumbnailCapture';
import CommonInput from './CommonInput';
import Button from './Button';
import CloseIconSrc from '@/assets/icons/close-24px.svg';
import ZoomInIconSrc from '@/assets/icons/zoomIn-24px.svg';
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

  const {
    isInBusan,
    hasCheckedLocation,
    handleCourseValidation,
    isLoading: validationLoading,
    startPoint,
    endPoint,
    setStartPoint,
    setEndPoint,
  } = useCourseCreation();

  const { showErrorToast } = useToast();

  const [currentStep, setCurrentStep] = useState<'courseInfo' | 'thumbnail'>('courseInfo');
  const [isLoading, setIsLoading] = useState(false);

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
      const result = await handleCourseValidation();

      if (result.isDuplicate) {
        showErrorToast('이미 등록된 코스명이에요.', { position: 'top' });
        return;
      }

      setCurrentStep('thumbnail');
    }
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
      setIsLoading(false);

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

            <Button variant="primary" fullWidth disabled={isButtonDisabled || validationLoading} onClick={handleNextStep}>
              {validationLoading ? <Spinner /> : '다음'}
            </Button>
          </>
        ) : (
          // 2단계: 썸네일 조정 및 미리보기
          <>
            <ThumbnailSection>
              <SectionTitle>썸네일 등록</SectionTitle>

              {/* 부산 지역 체크 후 경고 메시지 */}
              {hasCheckedLocation && isInBusan === false && (
                <WarningMessage>
                  <WarningTitle>
                    <img src={InfoIconSrc} alt="info" width={16} height={16} />
                    현재 베타 버전이에요!
                  </WarningTitle>
                  부산 외 지역은 내 주변 5km 내에서만
                  <br />
                  추천 코스로 표시됩니다.
                </WarningMessage>
              )}
              <MapPreview>
                <MapThumbnailCapture
                  ref={thumbnailMapRef}
                  coordinates={isGpxUploaded && gpxData?.coordinates ? gpxData.coordinates : routeCoordinates}
                  zoomLevel={zoomLevel}
                  onZoomChange={handleZoomChange}
                />
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
                {isLoading ? <Spinner /> : '완료'}
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

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;

  & > button {
    flex: 1;
  }
`;

const WarningTitle = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  ${theme.typography.caption1}
  color: var(--text-text-title, #1c1c1c);
  margin-bottom: 4px;
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

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

import Button from '@/components/Button';
import OnboardingImg1Src from '@/assets/images/onboarding-1.png';
import OnboardingImg2Src from '@/assets/images/onboarding-2.png';
import OnboardingImg3Src from '@/assets/images/onboarding-3.png';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [t] = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const onboardingData = [
    {
      title: t('modal.onboarding.title1'),
      image: OnboardingImg1Src,
    },
    {
      title: t('modal.onboarding.title2'),
      description: t('modal.onboarding.description2'),
      image: OnboardingImg2Src,
    },
    {
      title: t('modal.onboarding.title3'),
      description: t('modal.onboarding.description3'),
      image: OnboardingImg3Src,
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;

    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentStep < onboardingData.length - 1) {
        setCurrentStep(currentStep + 1);
      } else if (diffX < 0 && currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    }

    setStartX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (startX === null) return;

    const endX = e.clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentStep < onboardingData.length - 1) {
        setCurrentStep(currentStep + 1);
      } else if (diffX < 0 && currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    }

    setStartX(null);
  };

  if (!isOpen) return null;

  const currentData = onboardingData[currentStep];

  return (
    <Overlay onClick={onClose}>
      <ModalContainer
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <TitleWrapper>
          <StepIndicator>
            {currentStep + 1}
            {t('modal.onboarding.step')}
          </StepIndicator>
          <Title>{currentData.title}</Title>
          {currentData.description && <Description>{currentData.description}</Description>}
        </TitleWrapper>
        <ContentArea>
          <ImageSlider>
            <ImageTrack
              style={{
                transform:
                  window.innerWidth <= 600 ? `translateX(-${currentStep * (window.innerWidth - 32)}px)` : `translateX(-${currentStep * 536}px)`,
              }}
            >
              {onboardingData.map((data, index) => (
                <ImageContainer key={index} currentStep={index}>
                  <OnboardingImage src={data.image} alt={`Onboarding-${index + 1}`} currentStep={index} />
                </ImageContainer>
              ))}
            </ImageTrack>
          </ImageSlider>
        </ContentArea>
        <ProgressContainer>
          <ProgressDots>
            {onboardingData.map((_, index) => (
              <ProgressDot key={index} isActive={index === currentStep} />
            ))}
          </ProgressDots>
        </ProgressContainer>
        <Button variant="primary" onClick={handleNext}>
          {currentStep < onboardingData.length - 1 ? t('modal.onboarding.next') : t('modal.onboarding.start')}
        </Button>
        <SkipButton onClick={onClose}>{t('modal.onboarding.skip')}</SkipButton>
      </ModalContainer>
    </Overlay>
  );
};

export default OnboardingModal;

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
  width: 568px;
  height: 526px;
  background: var(--surface-surface-default, #ffffff);
  border-radius: 12px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.3s ease-out;
  user-select: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

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
    width: calc(100vw - 32px);
    height: 466px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const StepIndicator = styled.div`
  ${theme.typography.caption1}
  color: var(--text-text-primary, #4561ff);
  background: #d8e6ff;
  border-radius: 50px;
  padding: 4px 12px;
  margin-bottom: 4px;
`;

const Title = styled.span`
  ${theme.typography.subtitle3}
  color: var(--text-text-title, #1c1c1c);
`;

const Description = styled.p`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #6b7280);
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ImageSlider = styled.div`
  flex: 1;
  width: 536px;
  height: 260px;
  overflow: hidden;
  position: relative;

  @media (max-width: 600px) {
    width: calc(100vw - 32px);
    height: 200px;
  }
`;

const ImageTrack = styled.div`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  height: 100%;
`;

const ImageContainer = styled.div<{ currentStep: number }>`
  width: 536px;
  height: 260px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: ${({ currentStep }) => (currentStep === 1 ? 'flex-end' : 'center')};
  ${({ currentStep }) => currentStep === 1 && 'padding-right: 138px;'}

  @media (max-width: 600px) {
    width: calc(100vw - 32px);
    height: 200px;
    justify-content: ${({ currentStep }) => (currentStep === 1 ? 'flex-start' : 'center')};
    ${({ currentStep }) => currentStep === 1 && 'padding-left: calc((100vw - 32px - 220px) / 2 - 10px);'}
    ${({ currentStep }) => currentStep === 1 && 'padding-right: 0;'}
  }
`;

const OnboardingImage = styled.img<{ currentStep: number }>`
  width: ${({ currentStep }) => (currentStep === 1 ? '284px' : '260px')};
  height: 260px;
  object-fit: cover;
  border-radius: 12px;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;

  @media (max-width: 600px) {
    width: ${({ currentStep }) => (currentStep === 1 ? '220px' : '200px')};
    height: 200px;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ProgressDots = styled.div`
  display: flex;
  gap: 4px;
`;

const ProgressDot = styled.div<{ isActive: boolean }>`
  width: ${({ isActive }) => (isActive ? '24px' : '8px')};
  height: 8px;
  border-radius: 24px;
  background: ${({ isActive }) => (isActive ? 'var(--Primary-Primary001, #4561FF)' : 'var(--GrayScale-gray300, #E0E0E0)')};
  transition: background 0.2s ease;
`;

const SkipButton = styled.button`
  ${theme.typography.caption2}
  color: var(--GrayScale-gray500, #999);
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: var(--GrayScale-gray600, #777);
  }
`;

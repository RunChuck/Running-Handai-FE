import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import CommonInput from './CommonInput';
import Button from './Button';
import CloseIconSrc from '@/assets/icons/close-24px.svg';

interface CourseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startPoint: string, endPoint: string) => void;
  initialStartPoint?: string;
  initialEndPoint?: string;
}

const CourseEditModal = ({ isOpen, onClose, onConfirm, initialStartPoint = '', initialEndPoint = '' }: CourseEditModalProps) => {
  const [t] = useTranslation();
  const [startPoint, setStartPoint] = useState(initialStartPoint);
  const [endPoint, setEndPoint] = useState(initialEndPoint);

  // 모달이 열릴 때 props 초기값으로 상태 업데이트
  useEffect(() => {
    if (isOpen) {
      setStartPoint(initialStartPoint);
      setEndPoint(initialEndPoint);
    }
  }, [isOpen, initialStartPoint, initialEndPoint]);

  const isStartPointValid = startPoint.length > 0 && startPoint.length <= 20;
  const isEndPointValid = endPoint.length > 0 && endPoint.length <= 20;
  const hasChanged = startPoint !== initialStartPoint || endPoint !== initialEndPoint;
  const isFormValid = isStartPointValid && isEndPointValid && hasChanged;

  const handleConfirm = () => {
    if (isFormValid) {
      onConfirm(startPoint, endPoint);
    }
  };

  const handleClose = () => {
    setStartPoint('');
    setEndPoint('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <img src={CloseIconSrc} alt="close" />
        </CloseButton>

        <Title>내 코스 수정</Title>

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

        <ButtonRow>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" disabled={!isFormValid} onClick={handleConfirm}>
            수정
          </Button>
        </ButtonRow>
      </ModalContainer>
    </Overlay>
  );
};

export default CourseEditModal;

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

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;

  & > button {
    flex: 1;
  }
`;

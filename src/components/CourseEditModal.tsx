import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import CommonModal from './CommonModal';
import CommonInput from './CommonInput';

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

  const isStartPointValid = startPoint.length > 0 && startPoint.length <= 20;
  const isEndPointValid = endPoint.length > 0 && endPoint.length <= 20;
  const isFormValid = isStartPointValid && isEndPointValid;

  const handleConfirm = () => {
    if (isFormValid) {
      onConfirm(startPoint, endPoint);
    }
  };

  const handleClose = () => {
    setStartPoint(initialStartPoint);
    setEndPoint(initialEndPoint);
    onClose();
  };

  const content = (
    <FormContainer>
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
    </FormContainer>
  );

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      content={content}
      cancelText="취소"
      confirmText="수정"
      title="코스 수정"
      height="280px"
    />
  );
};

export default CourseEditModal;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-top: 16px;
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
  color: var(--text-text-title, #1c1c1c);
  text-align: left;
`;

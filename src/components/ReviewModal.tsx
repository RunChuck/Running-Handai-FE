import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import Button from './Button';

import CloseIconSrc from '@/assets/icons/close-24px.svg';
import StarRating from './StarRating';

type ReviewModalMode = 'create' | 'edit';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reviewText: string, rating?: number) => void;
  confirmText: string;
  placeholder?: string;
  mode?: ReviewModalMode;
  initialRating?: number;
  initialReviewText?: string;
}

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  confirmText, 
  mode = 'create',
  initialRating = 0,
  initialReviewText = ''
}: ReviewModalProps) => {
  const [t] = useTranslation();
  const [reviewText, setReviewText] = useState(initialReviewText);
  const [rating, setRating] = useState(initialRating);


  const handleConfirm = () => {
    onConfirm(reviewText, mode === 'edit' ? rating : undefined);
  };

  const isTextOverLimit = reviewText.length > 2000;
  const isButtonDisabled = reviewText.length === 0 || (mode === 'edit' && rating === 0) || isTextOverLimit;

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <img src={CloseIconSrc} alt="close" />
        </CloseButton>
        <Title>{t('modal.reviewModal.title')}</Title>

        {mode === 'edit' && (
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            label={t('modal.reviewModal.editRating')}
            padding={16}
          />
        )}

        <TextareaWrapper $isOverLimit={isTextOverLimit}>
          <Textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder={t('modal.reviewModal.placeholder')}
            maxLength={2000}
          />
          <CharacterCount $isOverLimit={isTextOverLimit}>
            {reviewText.length}
            <div style={{ color: 'var(--text-text-secondary, #757575)' }}>/2000</div>
          </CharacterCount>
        </TextareaWrapper>

        <Warning>{t('modal.reviewModal.warning')}</Warning>
        <Button fullWidth disabled={isButtonDisabled} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </ModalContainer>
    </Overlay>
  );
};

export default ReviewModal;

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
  min-height: 381px;
  background: var(--surface-surface-default, #ffffff);
  border-radius: 16px;
  padding: var(--spacing-32) var(--spacing-16) var(--spacing-16);
  display: flex;
  flex-direction: column;
  /* align-items: center; */
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

const TextareaWrapper = styled.div<{ $isOverLimit: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 0 37px 0;
  border-radius: 8px;
  border: 1px solid ${({ $isOverLimit }) => 
    $isOverLimit ? 'var(--system-error, #ff0010)' : 'var(--line-line-001, #eee)'};
  background: var(--surface-surface-highlight3, #f7f8fa);
  box-sizing: border-box;

  &:focus-within {
    border-color: ${({ $isOverLimit }) => 
      $isOverLimit ? 'var(--system-error, #ff0010)' : 'var(--primary-primary, #4261ff)'};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 159px;
  padding: var(--spacing-16) var(--spacing-16) 0 var(--spacing-16);
  border: none;
  background: transparent;
  resize: none;
  font-family: inherit;
  ${theme.typography.body2}
  color: var(--text-text-title, #1c1c1c);
  box-sizing: border-box;

  &::placeholder {
    color: var(--text-text-placeholder, #9e9e9e);
  }

  &:focus {
    outline: none;
  }
`;

const CharacterCount = styled.div<{ $isOverLimit: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
  position: absolute;
  bottom: 16px;
  right: 16px;
  ${theme.typography.body2}
  color: ${({ $isOverLimit }) => 
    $isOverLimit ? 'var(--system-error, #ff0010)' : 'var(--text-text-secondary, #757575)'};
`;

const Warning = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-title, #1c1c1c);
  text-align: left;
`;

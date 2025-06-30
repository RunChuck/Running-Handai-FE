import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import Button from './Button';

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  content: React.ReactNode;
  cancelText: string;
  confirmText: string;
}

const CommonModal = ({ isOpen, onClose, onConfirm, content, cancelText, confirmText }: CommonModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <Content>{content}</Content>
        <ButtonContainer>
          <Button
            onClick={onClose}
            backgroundColor="var(--surface-surface-highlight, #F4F4F4);"
            style={{ color: 'var(--GrayScale-gray700, #555)' }}
          >
            {cancelText}
          </Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default CommonModal;

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
  width: 343px;
  height: 196px;
  background: var(--surface-surface-default, #ffffff);
  border-radius: 16px;
  padding: var(--spacing-16);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: fadeIn 0.3s ease-out;

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

const Content = styled.div`
  ${theme.typography.modalContent}
  color: var(--text-text-title, #1c1c1c);
  text-align: center;
  line-height: 1.5;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: pre-wrap;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;

  button {
    flex: 1;
  }
`;

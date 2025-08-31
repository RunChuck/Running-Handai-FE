import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import Lottie from 'lottie-react';
import LoadingMotion from '@/assets/animations/run-loading.json';

interface CourseLoadingModalProps {
  isOpen: boolean;
}

const CourseLoadingModal = ({ isOpen }: CourseLoadingModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <AnimationContainer>
          <Lottie animationData={LoadingMotion} style={{ width: 100, height: 100 }} loop={true} />
        </AnimationContainer>
        <Message>코스를 저장하고 있어요</Message>
      </ModalContainer>
    </Overlay>
  );
};

export default CourseLoadingModal;

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
  z-index: 200;
`;

const ModalContainer = styled.div`
  background: var(--surface-surface-default, #ffffff);
  border-radius: 16px;
  padding: var(--spacing-24) var(--spacing-16);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  width: 164px;
  height: 164px;
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

const AnimationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
  text-align: center;
`;

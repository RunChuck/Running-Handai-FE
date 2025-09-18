import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import Lottie from 'lottie-react';
import LoadingMotion from '@/assets/animations/run-loading.json';
import CourseSavedIcon from '@/assets/icons/course-saved-check.svg';

interface CourseLoadingModalProps {
  isOpen: boolean;
  isCompleted?: boolean;
}

const CourseLoadingModal = ({ isOpen, isCompleted = false }: CourseLoadingModalProps) => {
  const [t] = useTranslation();

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer $isCompleted={isCompleted}>
        <AnimationContainer>
          {isCompleted ? (
            <SavedCircleIcon>
              <img src={CourseSavedIcon} alt="course saved" />
            </SavedCircleIcon>
          ) : (
            <Lottie animationData={LoadingMotion} style={{ width: 100, height: 100 }} loop={true} />
          )}
        </AnimationContainer>
        <Message>{isCompleted ? t('modal.courseCreation.saved') : t('modal.courseCreation.saving')}</Message>
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

const ModalContainer = styled.div<{ $isCompleted: boolean }>`
  background: var(--surface-surface-default, #ffffff);
  border-radius: 16px;
  padding: ${({ $isCompleted }) => ($isCompleted ? 'var(--spacing-36) var(--spacing-16) var(--spacing-24)' : 'var(--spacing-24) var(--spacing-16)')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const SavedCircleIcon = styled.div`
  display: flex;
  width: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  border-radius: 500px;
  background: linear-gradient(135deg, #4561ff -0.21%, #6078ff 99.79%);
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 4px;
`;

const Message = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
  text-align: center;
`;

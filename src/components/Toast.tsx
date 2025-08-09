import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { ToastType, type Toast as ToastInterface } from '@/types/toast';

import SuccessIconSrc from '@/assets/icons/toast-success.svg';
import FailedIconSrc from '@/assets/icons/toast-failed.svg';
import InfoIconSrc from '@/assets/icons/toast-info.svg';
import WarningIconSrc from '@/assets/icons/toast-warning.svg';

interface ToastProps {
  toast: ToastInterface;
  onClose: (id: string) => void;
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case ToastType.SUCCESS:
      return SuccessIconSrc;
    case ToastType.FAILED:
      return FailedIconSrc;
    case ToastType.INFO:
      return InfoIconSrc;
    case ToastType.WARNING:
      return WarningIconSrc;
    default:
      return InfoIconSrc;
  }
};

const Toast = ({ toast, onClose }: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, toast.duration - 300); // 300ms 전에 exit 시작

      const removeTimer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [toast.duration, toast.id, onClose]);

  return (
    <ToastContainer type={toast.type} position={toast.position || 'bottom'} isExiting={isExiting}>
      <ToastIcon src={getToastIcon(toast.type)} alt={toast.type} />
      <ToastMessage>{toast.message}</ToastMessage>
    </ToastContainer>
  );
};

export default Toast;

const ToastContainer = styled.div<{
  type: ToastType;
  position: ToastInterface['position'];
  isExiting: boolean;
}>`
  display: flex;
  width: 100%;
  height: 44px;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  border-radius: 12px;
  background: #fff;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: var(--spacing-8);

  animation: ${({ isExiting, position }) =>
    isExiting ? (position === 'top' ? 'slideOutUp 0.3s ease-in forwards' : 'slideOutDown 0.3s ease-in forwards') : 'slideIn 0.3s ease-out'};

  @keyframes slideIn {
    from {
      transform: ${({ position }) => (position === 'top' ? 'translateY(-100%)' : 'translateY(100%)')};
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideOutUp {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }

  @keyframes slideOutDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }
`;

const ToastIcon = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

const ToastMessage = styled.span`
  ${theme.typography.body2};
  color: #000;
  text-align: center;
  word-break: break-word;
`;

import { useContext } from 'react';
import { ToastContext } from '@/contexts/ToastContext';
import { ToastType, type ToastPosition } from '@/types/toast';

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('Provider 감싸야됨!');
  }

  const { showToast: originalShowToast, ...rest } = context;

  // 편의 메서드들
  const showToast = (
    message: string,
    type: ToastType = ToastType.INFO,
    options?: {
      position?: ToastPosition;
      duration?: number;
    }
  ) => {
    originalShowToast({
      message,
      type,
      position: options?.position || 'bottom',
      duration: options?.duration || 3000,
    });
  };

  const showSuccessToast = (
    message: string,
    options?: {
      position?: ToastPosition;
      duration?: number;
    }
  ) => {
    showToast(message, ToastType.SUCCESS, options);
  };

  const showErrorToast = (
    message: string,
    options?: {
      position?: ToastPosition;
      duration?: number;
    }
  ) => {
    showToast(message, ToastType.FAILED, options);
  };

  const showInfoToast = (
    message: string,
    options?: {
      position?: ToastPosition;
      duration?: number;
    }
  ) => {
    showToast(message, ToastType.INFO, options);
  };

  const showWarningToast = (
    message: string,
    options?: {
      position?: ToastPosition;
      duration?: number;
    }
  ) => {
    showToast(message, ToastType.WARNING, options);
  };

  return {
    ...rest,
    showToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
  };
};

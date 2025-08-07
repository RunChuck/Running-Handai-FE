import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import type { Toast, ToastContextValue, ToastPosition } from '@/types/toast';
import ToastComponent from '@/components/Toast';

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newToast: Toast = {
      id,
      position: 'bottom', // 기본값
      duration: 3000, // 기본값 3초
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextValue = {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
  };

  // 위치별로 토스트 그룹화
  const topToasts = toasts.filter(toast => toast.position === 'top');
  const bottomToasts = toasts.filter(toast => toast.position === 'bottom');

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 &&
        createPortal(
          <>
            {topToasts.length > 0 && (
              <ToastWrapper position="top">
                {topToasts.map(toast => (
                  <ToastComponent key={toast.id} toast={toast} onClose={hideToast} />
                ))}
              </ToastWrapper>
            )}
            {bottomToasts.length > 0 && (
              <ToastWrapper position="bottom">
                {bottomToasts.map(toast => (
                  <ToastComponent key={toast.id} toast={toast} onClose={hideToast} />
                ))}
              </ToastWrapper>
            )}
          </>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

const ToastWrapper = styled.div<{ position: ToastPosition }>`
  position: fixed;
  left: var(--spacing-16);
  right: var(--spacing-16);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;

  ${({ position }) =>
    position === 'top'
      ? `
    top: var(--spacing-24);
  `
      : `
    bottom: var(--spacing-24);
  `}

  & > * {
    pointer-events: all;
    width: 100%;
    max-width: 568px;
  }
`;

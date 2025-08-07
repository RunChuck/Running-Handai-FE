export enum ToastType {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  INFO = 'INFO',
  WARNING = 'WARNING',
}
export type ToastPosition = 'top' | 'bottom';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  position?: ToastPosition;
  duration?: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

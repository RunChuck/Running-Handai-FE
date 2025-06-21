import { useCallback, useRef } from 'react';

export const useDebounce = (callback: () => void, delay: number) => {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(() => {
    // 기존 타이머 클리어
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 새 타이머 설정
    debounceTimer.current = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  // 타이머 정리 함수
  const clearTimer = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
  }, []);

  return { debouncedCallback, clearTimer };
};

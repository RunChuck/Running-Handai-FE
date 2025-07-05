import { useRef, useCallback } from 'react';

export default function useScrollToTop() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return { scrollRef, scrollToTop };
}

import { useRef, useCallback, useState, useEffect } from 'react';

interface UseScrollToTopOptions {
  showButtonThreshold?: number;
}

export default function useScrollToTop(options: UseScrollToTopOptions = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showButtonThreshold = 100 } = options;
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToTop = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const scrollTop = scrollElement.scrollTop;
      setShowScrollButton(scrollTop > showButtonThreshold);
    };

    scrollElement.addEventListener('scroll', handleScroll);

    // 초기 상태 설정
    handleScroll();

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [showButtonThreshold]);

  return { scrollRef, scrollToTop, showScrollButton };
}

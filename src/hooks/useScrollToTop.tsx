import { useRef, useCallback, useState, useEffect } from 'react';

interface UseScrollToTopOptions {
  showButtonThreshold?: number;
}

export default function useScrollToTop(options: UseScrollToTopOptions = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showButtonThreshold = 50 } = options;
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToTop = useCallback(() => {
    // body에서 스크롤이 발생하고 있음
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
    // fallback용
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.body.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollButton(scrollTop > showButtonThreshold);
    };

    // body와 window 모두에 이벤트 리스너 등록
    document.body.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 초기 상태 설정
    handleScroll();

    return () => {
      document.body.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showButtonThreshold]);

  return { scrollRef, scrollToTop, showScrollButton };
}

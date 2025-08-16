import { useRef, useEffect } from 'react';

interface UseHorizontalScrollOptions {
  sensitivity?: number; // 드래그 민감도 (기본값: 2)
  wheelMultiplier?: number; // 휠 스크롤 배수 (기본값: 3)
}

export const useHorizontalScroll = (options: UseHorizontalScrollOptions = {}) => {
  const { sensitivity = 2, wheelMultiplier = 3 } = options;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // 마우스 드래그 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    isDragging.current = true;
    e.preventDefault();

    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * sensitivity;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 터치 드래그 핸들러 - useEffect로 passive 문제 해결
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let startX = 0;
    let scrollLeft = 0;

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;

      // 가로 스크롤이 가능한 경우에만 preventDefault 호출
      if (container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * sensitivity;
        container.scrollLeft = scrollLeft - walk;
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sensitivity]);

  // 휠 이벤트를 useEffect로 직접 등록 (passive: false로 설정)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // 가로 스크롤이 가능한 경우에만 preventDefault 호출
      if (container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * wheelMultiplier;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [wheelMultiplier]);

  return {
    scrollContainerRef,
    handleMouseDown,
  };
};

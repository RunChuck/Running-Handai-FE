import { useRef, useEffect } from 'react';

interface UseHorizontalScrollOptions {
  sensitivity?: number; // 드래그 민감도 (기본값: 1)
  wheelMultiplier?: number; // 휠 스크롤 배수 (기본값: 3)
}

export const useHorizontalScroll = (options: UseHorizontalScrollOptions = {}) => {
  const { sensitivity = 1, wheelMultiplier = 3 } = options;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // 스크롤 가능 여부 확인 및 커서 업데이트
  const updateScrollableState = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isScrollable = container.scrollWidth > container.clientWidth;
    container.setAttribute('data-scrollable', isScrollable.toString());
  };

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

  // 스크롤 가능 상태 업데이트
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 초기 상태 설정
    updateScrollableState();

    // ResizeObserver로 크기 변화 감지
    const resizeObserver = new ResizeObserver(updateScrollableState);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 터치 드래그 핸들러 - useEffect로 passive 문제 해결
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].pageX - container.offsetLeft;
      startY = e.touches[0].pageY;
      scrollLeft = container.scrollLeft;

      isDragging.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // 이미 드래그 중이면 계속 처리
      if (isDragging.current) {
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * sensitivity;
        container.scrollLeft = scrollLeft - walk;
        return;
      }

      const x = e.touches[0].pageX - container.offsetLeft;
      const y = e.touches[0].pageY;
      const deltaX = Math.abs(x - startX);
      const deltaY = Math.abs(y - startY);

      if (deltaX > 15 || deltaY > 15) {
        // 가로 스와이프가 더 크고, 스크롤 가능한 경우에만 드래그 시작
        if (deltaX > deltaY && container.scrollWidth > container.clientWidth) {
          isDragging.current = true;
          const walk = (x - startX) * sensitivity;
          container.scrollLeft = scrollLeft - walk;
        }
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
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
      // 가로 휠인 경우에만 가로 스크롤 처리
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        container.scrollLeft += e.deltaX * wheelMultiplier;
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
    updateScrollableState,
  };
};

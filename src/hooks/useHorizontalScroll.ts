import { useRef } from 'react';

interface UseHorizontalScrollOptions {
  sensitivity?: number; // 드래그 민감도 (기본값: 2)
  wheelMultiplier?: number; // 휠 스크롤 배수 (기본값: 3)
}

export const useHorizontalScroll = (options: UseHorizontalScrollOptions = {}) => {
  const { sensitivity = 2, wheelMultiplier = 3 } = options;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 마우스 드래그 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault(); // 컨텐츠 선택 방지

    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault(); // 드래그 중 선택 방지
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * sensitivity;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 휠 핸들러
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.currentTarget.scrollLeft += e.deltaY * wheelMultiplier;
  };

  return {
    scrollContainerRef,
    handleMouseDown,
    handleWheel,
  };
};

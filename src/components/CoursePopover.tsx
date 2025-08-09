import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

interface CourseOption {
  courseId: number;
  label: string;
  title: string;
}

interface CoursePopoverProps {
  courses: CourseOption[];
  position: { x: number; y: number };
  onSelect: (courseId: number) => void;
  onClose: () => void;
}

const CoursePopover = ({ courses, position, onSelect, onClose }: CoursePopoverProps) => {
  const [t] = useTranslation();
  const popoverRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 및 터치시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  const handleSelect = (courseId: number) => {
    onSelect(courseId);
    onClose();
  };

  return (
    <PopoverContainer
      ref={popoverRef}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {courses.map(course => (
        <CourseOption key={course.courseId} onClick={() => handleSelect(course.courseId)}>
          <CourseLabel>
            {course.label}
            {t('course')}
          </CourseLabel>
        </CourseOption>
      ))}
    </PopoverContainer>
  );
};

export default CoursePopover;

const PopoverContainer = styled.div`
  position: absolute;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--line-line-001, #eeeeee);
  width: 70px;
  z-index: 1000;
  transform: translate(-50%, -100%);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid white;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -9px;
    width: 0;
    height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 9px solid #eeeeee;
  }
`;

const CourseOption = styled.button`
  width: 100%;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f5f7ff;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--Line-line001, #eee);
  }
`;

const CourseLabel = styled.div`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

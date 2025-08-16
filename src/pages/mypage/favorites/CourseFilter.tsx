import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from '@/styles/theme';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { COURSE_LOCATIONS } from '@/constants/locations';
import type { AreaCode } from '@/types/course';

import SVGColor from '@/components/SvgColor';
import ArrowIconSrc from '@/assets/icons/arrow-down-16px.svg';

interface CourseFilterProps {
  selectedArea: AreaCode | null;
  onAreaChange: (area: AreaCode | null) => void;
}

const CourseFilter = ({ selectedArea, onAreaChange }: CourseFilterProps) => {
  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { scrollContainerRef, handleMouseDown, handleWheel } = useHorizontalScroll();

  const locationOptions = ['all', ...Object.keys(COURSE_LOCATIONS)];
  
  const handleLocationSelect = (location: string) => {
    if (location === 'all') {
      onAreaChange(null);
    } else {
      onAreaChange(location as AreaCode);
    }
  };

  return (
    <FilterContainer isOpen={isOpen}>
      <FilterButton onClick={() => setIsOpen(!isOpen)}>
        <FilterText>{t('mypage.favorites.filter')}</FilterText>
        <SVGColor
          src={ArrowIconSrc}
          alt="arrow"
          color="#BBBBBB"
          width={16}
          height={16}
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </FilterButton>
      <FilterList isOpen={isOpen} ref={scrollContainerRef} onMouseDown={handleMouseDown} onWheel={handleWheel}>
        {locationOptions.map(location => (
          <FilterOption key={location} isSelected={location === 'all' ? selectedArea === null : selectedArea === location} onClick={() => handleLocationSelect(location)}>
            {t(`location.${location.toLowerCase()}`).replace('\n', '/')}
          </FilterOption>
        ))}
      </FilterList>
    </FilterContainer>
  );
};

export default CourseFilter;

const FilterContainer = styled.div<{ isOpen: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 24px 0;
  gap: ${props => (props.isOpen ? 'var(--spacing-12)' : '0')};
  transition: gap 0.3s ease;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  padding-right: var(--spacing-16);
  gap: var(--spacing-4);
`;

const FilterText = styled.span`
  ${theme.typography.caption1}
  color: var(--text-text-secondary, #555555);

  &:hover {
    color: var(--GrayScale-gray600, #777777);
  }
`;

const FilterList = styled.div<{ isOpen: boolean }>`
  display: flex;
  width: 100%;
  padding: 0 var(--spacing-16);
  gap: var(--spacing-8);
  align-self: flex-start;
  overflow: hidden;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  max-height: ${props => (props.isOpen ? '50px' : '0')};
  transition:
    opacity 0.3s ease,
    max-height 0.3s ease;
`;

const FilterOption = styled.button<{ isSelected: boolean }>`
  ${theme.typography.body2}
  padding: var(--spacing-8) var(--spacing-12);
  border-radius: 4px;
  white-space: nowrap;
  cursor: pointer;

  ${({ isSelected }) =>
    isSelected
      ? css`
          ${theme.typography.caption1}
          color: var(--text-text-inverse, #ffffff);
          background: var(--primary-primary, #4561ff);

          &:hover {
            background-color: var(--primary-primary002, #2845e9);
          }
        `
      : css`
          color: var(--text-text-disabled, #bbbbbb);
          background: var(--Surface-highlight3, #f7f8fa);

          &:hover {
            background-color: var(--GrayScale-gray200, #eeeeee);
          }
        `}
`;

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  width?: number;
  padding?: string;
  usePortal?: boolean;
}

interface DropdownItemProps {
  onClick?: (e: React.MouseEvent) => void;
  children: ReactNode;
  variant?: 'default' | 'danger';
}

const Dropdown = ({ trigger, children, isOpen: controlledIsOpen, onToggle, width = 80, padding = '4px', usePortal = false }: DropdownProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onToggle || setInternalIsOpen;

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (usePortal && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top,
        right: window.innerWidth - rect.left,
      });
    }

    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedOnTrigger = triggerRef.current && triggerRef.current.contains(target);
      const clickedOnMenu = dropdownRef.current && dropdownRef.current.contains(target);

      if (!clickedOnTrigger && !clickedOnMenu) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const renderMenu = () => {
    if (!isOpen) return null;

    const menu = (
      <DropdownMenu ref={dropdownRef} width={width} $usePortal={usePortal} $top={menuPosition.top} $right={menuPosition.right}>
        {children}
      </DropdownMenu>
    );

    return usePortal ? createPortal(menu, document.body) : menu;
  };

  return (
    <DropdownContainer>
      <TriggerButton ref={triggerRef} onClick={handleTriggerClick} $padding={padding}>
        {trigger}
      </TriggerButton>
      {!usePortal && renderMenu()}
      {usePortal && renderMenu()}
    </DropdownContainer>
  );
};

const DropdownItem = ({ onClick, children, variant = 'default' }: DropdownItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <StyledDropdownItem onClick={handleClick} $variant={variant}>
      {children}
    </StyledDropdownItem>
  );
};

export { Dropdown, DropdownItem };

const DropdownContainer = styled.div`
  position: relative;
`;

const TriggerButton = styled.div<{ $padding: string }>`
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  padding: ${({ $padding }) => $padding};

  &:hover {
    background: var(--surface-surface-highlight, #f5f5f5);
  }
`;

const DropdownMenu = styled.div<{
  width: number;
  $usePortal: boolean;
  $top: number;
  $right: number;
}>`
  position: ${props => (props.$usePortal ? 'fixed' : 'absolute')};
  top: ${props => (props.$usePortal ? `${props.$top}px` : '0')};
  right: ${props => (props.$usePortal ? `${props.$right}px` : '100%')};
  background: white;
  border: 1px solid var(--line-line-001, #eeeeee);
  border-radius: 4px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: ${props => props.width}px;
  overflow: hidden;
`;

const StyledDropdownItem = styled.button<{ $variant: 'default' | 'danger' }>`
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  ${theme.typography.body2};
  color: ${props => (props.$variant === 'danger' ? 'var(--text-text-error, #ff0010)' : 'var(--text-text-secondary, #555555)')};
  text-align: center;
  transition: background-color 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: var(--surface-surface-highlight, #f4f4f4);
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--line-line-001, #eeeeee);
  }
`;

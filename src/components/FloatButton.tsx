import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { type ReactNode } from 'react';

interface FloatButtonProps {
  children: ReactNode;
  onClick: () => void;
  position: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    center?: boolean;
  };
  size?: 'small' | 'medium' | 'large';
  variant?: 'circular' | 'rounded' | 'pill';
  className?: string;
}

const FloatButton = ({
  children,
  onClick,
  position,
  size = 'medium',
  variant = 'circular',
  className,
}: FloatButtonProps) => {
  return (
    <StyledFloatButton onClick={onClick} position={position} size={size} variant={variant} className={className}>
      {children}
    </StyledFloatButton>
  );
};

const StyledFloatButton = styled.div<{
  position: FloatButtonProps['position'];
  size: FloatButtonProps['size'];
  variant: FloatButtonProps['variant'];
}>`
  position: absolute;
  z-index: 100;

  /* 위치 설정 */
  ${({ position }) => position.top !== undefined && `top: ${position.top}px;`}
  ${({ position }) => position.bottom !== undefined && `bottom: ${position.bottom}px;`}
  ${({ position }) => position.left !== undefined && `left: ${position.left}px;`}
  ${({ position }) => position.right !== undefined && `right: ${position.right}px;`}
  
  /* 중앙 정렬 */
  ${({ position }) =>
    position.center &&
    `
    left: 50%;
    transform: translateX(-50%);
  `}
  
  /* 크기 설정 */
  ${({ size, variant }) => {
    if (variant === 'pill') {
      return `
        height: 44px;
        padding: var(--spacing-8) var(--spacing-16);
        gap: var(--spacing-4);
        ${theme.typography.caption1}
        color: var(--text-text-title, #1c1c1c);
        white-space: nowrap;
      `;
    }

    switch (size) {
      case 'small':
        return `
          width: 32px;
          height: 32px;
        `;
      case 'medium':
        return `
          width: 44px;
          height: 44px;
        `;
      case 'large':
        return `
          width: 56px;
          height: 56px;
        `;
      default:
        return `
          width: 44px;
          height: 44px;
        `;
    }
  }}
  
  /* 모양 설정 */
  ${({ variant }) => {
    switch (variant) {
      case 'circular':
        return `border-radius: 50%;`;
      case 'rounded':
        return `border-radius: 8px;`;
      case 'pill':
        return `border-radius: 50px;`;
      default:
        return `border-radius: 50%;`;
    }
  }}
  
  /* 공통 스타일 */
  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--surface-surface-default, #fff);
  border: 1px solid var(--line-line-002, #e0e0e0);
  box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.2);

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    ${({ position }) => (position.center ? `transform: translateX(-50%) scale(1.02);` : `transform: scale(1.05);`)}
    box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.25);
  }

  &:active {
    ${({ position }) => (position.center ? `transform: translateX(-50%) scale(0.98);` : `transform: scale(0.95);`)}
  }

  /* 아이콘 스타일 */
  img {
    ${({ size }) => {
      switch (size) {
        case 'small':
          return `
            width: 16px;
            height: 16px;
          `;
        case 'medium':
          return `
            width: 24px;
            height: 24px;
          `;
        case 'large':
          return `
            width: 32px;
            height: 32px;
          `;
        default:
          return `
            width: 24px;
            height: 24px;
          `;
      }
    }}
  }
`;

export default FloatButton;

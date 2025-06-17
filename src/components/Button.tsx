import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export type ButtonSize = 'md' | 'lg';
export type IconPosition = 'center' | 'left';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  maxWidth?: string;
  fullWidth?: boolean;
  size?: ButtonSize;
  backgroundColor?: string;
  startIcon?: React.ReactNode;
  iconPosition?: IconPosition;
}

const ButtonBase = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  color: #fff;
  position: relative;

  ${({ iconPosition = 'center' }) => {
    if (iconPosition === 'left') {
      return css`
        justify-content: center;
        padding-left: 48px;
      `;
    }
    return css`
      justify-content: center;
      gap: 12px;
    `;
  }}

  /* 크기 설정 */
  ${({ size = 'md' }) => {
    switch (size) {
      case 'lg':
        return css`
          padding: 12px 16px;
          height: 52px;
          font-size: 18px;
          font-weight: 500;
        `;
      default:
        return css`
          padding: 10px 16px;
          height: 44px;
          font-size: 16px;
          font-weight: 500;
        `;
    }
  }}

  background-color: ${({ backgroundColor }) => backgroundColor || 'var(--primary-primary)'};

  max-width: ${({ maxWidth }) => maxWidth || 'none'};

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const IconWrapper = styled.div<{ iconPosition?: IconPosition }>`
  ${({ iconPosition = 'center' }) => {
    if (iconPosition === 'left') {
      return css`
        position: absolute;
        left: 16px;
        display: flex;
        align-items: center;
      `;
    }
    return css`
      display: flex;
      align-items: center;
    `;
  }}
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, startIcon, iconPosition = 'center', ...props }, ref) => {
    return (
      <ButtonBase ref={ref} iconPosition={iconPosition} {...props}>
        {startIcon && <IconWrapper iconPosition={iconPosition}>{startIcon}</IconWrapper>}
        {children}
      </ButtonBase>
    );
  }
);

Button.displayName = 'Button';

export default Button;

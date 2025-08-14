import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export type ButtonSize = 'md' | 'lg';
export type ButtonVariant = 'primary' | 'secondary';
export type IconPosition = 'center' | 'left';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  maxWidth?: string;
  fullWidth?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  backgroundColor?: string;
  startIcon?: React.ReactNode;
  iconPosition?: IconPosition;
  border?: string;
  borderRadius?: string | number;
  textColor?: string;
  customTypography?: boolean;
}

const ButtonBase = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  border-radius: ${({ borderRadius }) => (typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius || '8px')};
  border: ${({ border }) => border || 'none'};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
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
  ${({ size = 'md', customTypography }) => {
    const baseStyles = css`
      padding: 10px 16px;
      height: 44px;
    `;

    const lgStyles = css`
      padding: 12px 16px;
      height: 52px;
    `;

    const fontStyles = css`
      font-size: ${size === 'lg' ? '18px' : '16px'};
      font-weight: 500;
    `;

    return css`
      ${size === 'lg' ? lgStyles : baseStyles}
      ${!customTypography && fontStyles}
    `;
  }}

  ${({ variant = 'primary', backgroundColor, textColor }) => {
    if (backgroundColor) {
      return css`
        background-color: ${backgroundColor};
        color: ${textColor || '#fff'};
      `;
    }

    if (variant === 'secondary') {
      return css`
        background-color: var(--secondary-default, #f4f4f4);
        color: var(--text-text-secondary, #555555);

        &:hover:not(:disabled) {
          background-color: var(--secondary-hover, #eeeeee);
        }

        &:active:not(:disabled) {
          background-color: var(--secondary-active, #e4e4e4);
        }

        &:disabled {
          background-color: var(--secondary-default, #f4f4f4);
          color: var(--text-text-disabled, #bbbbbb);
        }
      `;
    }

    return css`
      background-color: var(--primary-primary, #4561ff);
      color: var(--text-text-inverse, #ffffff);

      &:hover:not(:disabled) {
        background-color: var(--primary-primary002, #2845e9);
      }

      &:active:not(:disabled) {
        background-color: var(--primary-primary003, #1b37d3);
      }

      &:disabled {
        background-color: var(--GrayScale-gray400, #bbbbbb);
        color: #fff;
      }
    `;
  }}

  max-width: ${({ maxWidth }) => maxWidth || 'none'};

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ variant }) =>
    !variant &&
    css`
      &:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        transform: none;
        cursor: not-allowed;
      }
    `}
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, startIcon, iconPosition = 'center', ...props }, ref) => {
  return (
    <ButtonBase ref={ref} iconPosition={iconPosition} {...props}>
      {startIcon && <IconWrapper iconPosition={iconPosition}>{startIcon}</IconWrapper>}
      {children}
    </ButtonBase>
  );
});

Button.displayName = 'Button';

export default Button;

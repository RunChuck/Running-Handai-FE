import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

export type InputState = 'default' | 'active' | 'negative' | 'positive';

interface CommonInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  state?: InputState;
  validationText?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'tel';
  onFocus?: () => void;
  onBlur?: () => void;
}

const CommonInput = ({
  placeholder,
  value = '',
  onChange,
  state = 'default',
  validationText,
  disabled = false,
  type = 'text',
  onFocus,
  onBlur,
}: CommonInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <InputContainer>
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        state={state}
        isFocused={isFocused}
        hasValue={!!value}
      />
      {(state === 'positive' || state === 'negative') && validationText && <ValidationText state={state}>{validationText}</ValidationText>}
    </InputContainer>
  );
};

export default CommonInput;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
`;

const StyledInput = styled.input<{
  state: InputState;
  isFocused: boolean;
  hasValue: boolean;
}>`
  ${theme.typography.body1};
  height: 44px;
  padding: 10px 16px;
  border-radius: 4px;
  border: 1px solid;
  background-color: var(--surface-surface-default);
  transition: all 0.2s ease;

  /* Border Colors */
  border-color: ${({ state, isFocused }) => {
    if (state === 'active' || isFocused) return 'var(--GrayScale-gray900)'; // #1C1C1C
    if (state === 'negative') return 'var(--system-error)'; // #FF0010
    if (state === 'positive') return 'var(--system-success)'; // #00BF6A
    return 'var(--GrayScale-gray300)'; // #E0E0E0 (default)
  }};

  /* Text Colors */
  color: ${({ hasValue, isFocused }) => {
    if (isFocused) return 'var(--text-text-title)'; // #1C1C1C (입력 중)
    if (hasValue) return 'var(--text-text-secondary)'; // #555555 (완료)
    return 'var(--text-text-secondary)'; // #555555
  }};

  /* Placeholder */
  &::placeholder {
    color: var(--text-text-disabled); // #BBBBBB
  }

  /* Hover */
  &:hover:not(:focus):not(:disabled) {
    border-color: ${({ state }) => {
      if (state === 'negative') return 'var(--system-error)';
      if (state === 'positive') return 'var(--system-success)';
      return 'var(--GrayScale-gray400)'; // #BBBBBB
    }};
  }

  /* Disabled */
  &:disabled {
    background-color: var(--surface-surface-highlight);
    color: var(--text-text-disabled);
    border-color: var(--GrayScale-gray300);
    cursor: not-allowed;
  }

  /* Focus */
  &:focus {
    outline: none;
  }
`;

const ValidationText = styled.span<{ state: InputState }>`
  ${theme.typography.caption2};
  color: ${({ state }) => (state === 'positive' ? 'var(--system-success)' : 'var(--system-error)')};
`;

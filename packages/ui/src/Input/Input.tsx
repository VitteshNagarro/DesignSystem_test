import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'disabled';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  state?: InputState;
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 px-spacing-sm text-font-size-sm rounded-radius-sm',
  md: 'h-10 px-spacing-md text-font-size-md rounded-radius-md',
  lg: 'h-12 px-spacing-lg text-font-size-lg rounded-radius-md',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      state = 'default',
      label,
      helperText,
      errorMessage,
      className,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const isError = state === 'error' || Boolean(errorMessage);
    const isDisabled = state === 'disabled' || disabled;

    return (
      <div className="flex flex-col gap-spacing-xs">
        {label && (
          <label
            htmlFor={inputId}
            className="text-font-size-sm font-medium text-color-text-default"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={isDisabled}
          aria-invalid={isError}
          aria-describedby={
            errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={cn(
            'w-full border bg-color-bg-surface text-color-text-default placeholder:text-color-text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-color-border-focus disabled:cursor-not-allowed disabled:opacity-50',
            isError
              ? 'border-color-border-danger focus-visible:ring-color-border-danger'
              : 'border-color-border-default',
            sizeClasses[size],
            className,
          )}
          {...props}
        />
        {errorMessage && (
          <p id={`${inputId}-error`} className="text-font-size-sm text-color-text-danger">
            {errorMessage}
          </p>
        )}
        {!errorMessage && helperText && (
          <p id={`${inputId}-helper`} className="text-font-size-sm text-color-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

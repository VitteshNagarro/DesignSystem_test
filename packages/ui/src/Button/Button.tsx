import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

/** Matches Figma component set "Buttons" variants: Primary, Secondary, Tertiary */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-color-bg-primary text-color-text-inverse hover:opacity-90 disabled:opacity-50',
  secondary:
    'bg-color-bg-secondary text-color-text-default border border-color-border-default hover:bg-color-bg-surface disabled:opacity-50',
  tertiary:
    'bg-transparent text-color-text-default border border-[var(--color-text-default)] hover:bg-color-bg-secondary disabled:opacity-50',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-spacing-lg [font-size:var(--font-size-sm)] gap-spacing-xs rounded-radius-sm',
  md: 'h-11 px-spacing-xl [font-size:var(--font-size-md)] gap-spacing-sm rounded-radius-md',
  lg: 'h-12 px-spacing-2xl [font-size:var(--font-size-lg)] gap-spacing-sm rounded-radius-md',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center font-normal transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-color-border-focus',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-radius-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  title?: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  elevated: 'bg-color-bg-surface shadow-md border border-transparent',
  outlined: 'bg-color-bg-surface border border-color-border-default',
  filled: 'bg-color-bg-secondary border border-transparent',
};

export function Card({
  variant = 'outlined',
  title,
  description,
  footer,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-radius-lg p-spacing-lg gap-spacing-md',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <div className="flex flex-col gap-spacing-xs">
          {title && (
            <h3 className="text-font-size-lg font-semibold text-color-text-default">{title}</h3>
          )}
          {description && (
            <p className="text-font-size-sm text-color-text-muted">{description}</p>
          )}
        </div>
      )}
      {children && <div className="text-font-size-md text-color-text-default">{children}</div>}
      {footer && (
        <div className="mt-spacing-sm border-t border-color-border-default pt-spacing-md">
          {footer}
        </div>
      )}
    </div>
  );
}

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'label';

export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TypographyColor = 'default' | 'muted' | 'inverse' | 'danger';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  color?: TypographyColor;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'label';
  children: ReactNode;
}

const variantClasses: Record<TypographyVariant, string> = {
  display: 'text-font-size-2xl leading-tight',
  h1: 'text-font-size-xl leading-tight',
  h2: 'text-font-size-lg leading-tight',
  h3: 'text-font-size-md leading-normal',
  body: 'text-font-size-md leading-normal',
  'body-sm': 'text-font-size-sm leading-normal',
  caption: 'text-font-size-xs leading-normal',
  label: 'text-font-size-sm leading-normal',
};

const weightClasses: Record<TypographyWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const colorClasses: Record<TypographyColor, string> = {
  default: 'text-color-text-default',
  muted: 'text-color-text-muted',
  inverse: 'text-color-text-inverse',
  danger: 'text-color-text-danger',
};

const defaultElement: Record<TypographyVariant, TypographyProps['as']> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  label: 'label',
};

export function Typography({
  variant = 'body',
  weight = 'regular',
  color = 'default',
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as ?? defaultElement[variant] ?? 'p';

  return (
    <Component
      className={cn(
        variantClasses[variant],
        weightClasses[weight],
        colorClasses[color],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

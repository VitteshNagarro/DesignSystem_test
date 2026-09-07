/** @type {import('tailwindcss').Config} */
export default {
  content: ['../../packages/ui/src/**/*.{js,ts,jsx,tsx}', './.storybook/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'color-bg-primary': 'var(--color-bg-primary)',
        'color-bg-secondary': 'var(--color-bg-secondary)',
        'color-bg-surface': 'var(--color-bg-surface)',
        'color-bg-danger': 'var(--color-bg-danger)',
        'color-text-default': 'var(--color-text-default)',
        'color-text-muted': 'var(--color-text-muted)',
        'color-text-inverse': 'var(--color-text-inverse)',
        'color-text-danger': 'var(--color-text-danger)',
        'color-border-default': 'var(--color-border-default)',
        'color-border-focus': 'var(--color-border-focus)',
        'color-border-danger': 'var(--color-border-danger)',
      },
      spacing: {
        'spacing-xs': 'var(--spacing-xs)',
        'spacing-sm': 'var(--spacing-sm)',
        'spacing-md': 'var(--spacing-md)',
        'spacing-lg': 'var(--spacing-lg)',
        'spacing-xl': 'var(--spacing-xl)',
        'spacing-2xl': 'var(--spacing-2xl)',
      },
      borderRadius: {
        'radius-sm': 'var(--radius-sm)',
        'radius-md': 'var(--radius-md)',
        'radius-lg': 'var(--radius-lg)',
        'radius-full': 'var(--radius-full)',
      },
      fontSize: {
        'font-size-xs': 'var(--font-size-xs)',
        'font-size-sm': 'var(--font-size-sm)',
        'font-size-md': 'var(--font-size-md)',
        'font-size-lg': 'var(--font-size-lg)',
        'font-size-xl': 'var(--font-size-xl)',
        'font-size-2xl': 'var(--font-size-2xl)',
      },
    },
  },
  plugins: [],
};

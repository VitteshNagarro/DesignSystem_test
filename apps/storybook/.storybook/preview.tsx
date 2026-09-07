import React from 'react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '@design-system/tokens/css';
import '../../../packages/ui/src/styles.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: '#ffffff' },
        { name: 'secondary', value: '#f1f5f9' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <div className="font-sans p-spacing-lg min-w-[320px]">
        <Story />
      </div>
    ),
  ],
};

export default preview;

const path = require('node:path');

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../../../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
    '@storybook/addon-designs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@design-system/ui': path.join(__dirname, '../../../packages/ui/src'),
          '@design-system/tokens/css': path.join(
            __dirname,
            '../../../packages/tokens/dist/css/variables.css',
          ),
          '@design-system/tokens': path.join(__dirname, '../../../packages/tokens'),
        },
      },
    });
  },
};

module.exports = config;

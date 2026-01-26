import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    // SVG를 React 컴포넌트로 처리
    const fileLoaderRule = config.module?.rules?.find((rule) => {
      if (rule && typeof rule === 'object' && rule.test instanceof RegExp) {
        return rule.test.test('.svg');
      }
      return false;
    });

    if (fileLoaderRule && typeof fileLoaderRule === 'object') {
      fileLoaderRule.exclude = /\.svg$/;
    }

    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default config;

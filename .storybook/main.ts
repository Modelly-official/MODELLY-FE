import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-links'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../public'],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  babel: async (config) => {
    config.presets = [
      '@babel/preset-env',
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ];
    return config;
  },
  webpackFinal: async (config) => {
    // Path alias 설정
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '..'),
      };
    }

    // babel-loader 추가 (모든 TypeScript/JSX 파일용)
    config.module?.rules?.unshift({
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      ],
    });

    // CSS에서 root-relative URL (예: /fonts/...) 을 그대로 유지
    config.module?.rules?.forEach((rule) => {
      if (rule && typeof rule === 'object' && rule.test instanceof RegExp && rule.test.test('.css')) {
        if (Array.isArray(rule.use)) {
          rule.use.forEach((loader: unknown) => {
            if (
              loader &&
              typeof loader === 'object' &&
              'loader' in loader &&
              typeof (loader as { loader: string }).loader === 'string' &&
              (loader as { loader: string }).loader.includes('css-loader')
            ) {
              const cssLoader = loader as { loader: string; options?: Record<string, unknown> };
              cssLoader.options = {
                ...cssLoader.options,
                url: {
                  filter: (url: string) => !url.startsWith('/'),
                },
              };
            }
          });
        }
      }
    });

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

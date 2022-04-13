// import { dirname, relative } from 'path';
import { defineConfig, type UserConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import icons from 'unplugin-icons/vite';
import autoImport from 'unplugin-auto-import/vite';
import windiCSS from 'vite-plugin-windicss';
import windiConfig from './windi.config';
import { r, port, isDev } from './scripts/utils';
import manifest from './scripts/manifest';
import webExtension from 'vite-plugin-web-extension';

const browser: string = process.env.TARGET_BROWSER ?? 'chrome';

export const sharedConfig: UserConfig = {
  root: r('src'),
  envDir: r('.'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    svelte(),

    autoImport({
      imports: [
        'svelte',
        'svelte/animate',
        'svelte/easing',
        'svelte/motion',
        'svelte/store',
        'svelte/transition',
        {
          'webextension-polyfill': [['*', 'browser']],
        },
      ],
      dts: r('src/auto-imports.d.ts'),
    }),

    // https://github.com/antfu/unplugin-icons
    icons({ compiler: 'svelte' }),

    // // rewrite assets to use relative path
    // {
    //   name: 'assets-rewrite',
    //   enforce: 'post',
    //   apply: 'build',
    //   transformIndexHtml(html, { path }) {
    //     return html.replace(
    //       /"\/assets\//g,
    //       `"${relative(dirname(path), '/assets')}/`,
    //     );
    //   },
    // },
  ],
  optimizeDeps: {
    include: ['svelte', 'webextension-polyfill'],
  },
};

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === 'serve' ? `http://localhost:${port}/` : '/',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  build: {
    outDir: r('dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        background: r('src/background/index.html'),
        options: r('src/options/index.html'),
        popup: r('src/popup/index.html'),
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...sharedConfig.plugins!,

    command === 'build'
      ? webExtension({
          assets: 'assets',
          browser,
          manifest,
        })
      : undefined,

    // https://github.com/antfu/vite-plugin-windicss
    windiCSS({
      config: windiConfig,
    }),
  ],
}));

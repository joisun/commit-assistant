import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import tailwindConfig from './tailwind.config.mjs'

const production = !process.env.ROLLUP_WATCH

const sharedPlugins = (isSettings = false) => [
  svelte({
    preprocess: sveltePreprocess({
      sourceMap: !production,
    }),
    compilerOptions: {
      dev: !production,
    },
    emitCss: true,
  }),
  postcss({
    plugins: [tailwindcss(tailwindConfig), autoprefixer],
    extract: 'bundle.css',
    minimize: production,
  }),
  resolve({
    browser: true,
    dedupe: ['svelte'],
  }),
  commonjs(),
  typescript({
    sourceMap: !production,
    inlineSources: !production,
    tsconfig: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'webviews/tsconfig.json'),
    include: ['**/*.ts'],
    exclude: ['**/*.svelte'],
  }),
  production && terser(),
]

export default [
  {
    input: 'webviews/commit-editor/main.ts',
    output: {
      sourcemap: !production,
      format: 'iife',
      name: 'app',
      file: 'out/webview/bundle.js',
    },
    plugins: sharedPlugins(),
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'webviews/commit-editor/settings.ts',
    output: {
      sourcemap: !production,
      format: 'iife',
      name: 'settingsApp',
      file: 'out/webview/settings-bundle.js',
    },
    plugins: sharedPlugins(true),
    watch: {
      clearScreen: false,
    },
  },
]

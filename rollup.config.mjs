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
      typescript: {
        tsconfigFile: './webviews/tsconfig.json',
      },
    }),
    compilerOptions: {
      dev: !production,
    },
    emitCss: true, // Always emit CSS
  }),
  postcss({
    plugins: [tailwindcss(tailwindConfig), autoprefixer],
    extract: isSettings ? 'settings-bundle.css' : 'bundle.css', // Use different files
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
    input: 'webviews/settings/main.ts',
    output: {
      sourcemap: !production,
      format: 'iife',
      name: 'settingsApp',
      file: 'out/webview/settings-bundle.js',
    },
    plugins: sharedPlugins(true), // Use shared plugins and tell it it's for settings
    watch: {
      clearScreen: false,
    },
  },
]

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

export default {
  input: 'webview/main.ts',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'app',
    file: 'out/webview/bundle.js',
  },
  plugins: [
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
      tsconfig: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'webview/tsconfig.json'),
    }),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}

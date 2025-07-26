import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-css-only'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

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
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      }),
      compilerOptions: {
        dev: !production,
      },
    }),
    css({ output: 'bundle.css' }),
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

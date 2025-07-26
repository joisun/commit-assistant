declare module '*.svelte' {
  import type { SvelteComponentTyped } from 'svelte'
  export default class extends SvelteComponentTyped<any, any, any> {}
}

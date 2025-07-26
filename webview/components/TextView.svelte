<script lang="ts">
  import { onMount } from 'svelte';

  export let value: string;
  let textarea: HTMLTextAreaElement;

  function autoGrow() {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  onMount(() => {
    autoGrow();
  });

  $: if (value) {
    if (textarea) {
      autoGrow();
    }
  }
</script>

<div>
  <label for="commit-text" class="block text-sm font-medium mb-1">Commit Message</label>
  <textarea
    bind:this={textarea}
    id="commit-text"
    rows="4"
    bind:value
    on:input={autoGrow}
    placeholder="Write your commit message here..."
    class="w-full resize-none overflow-hidden"
  ></textarea>
</div>

<style>
  label {
    color: var(--vscode-foreground);
  }
  textarea {
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 2px;
    padding: 4px;
    font-size: var(--vscode-font-size);
  }
  textarea:focus {
    outline: 1px solid var(--vscode-focusBorder);
    outline-offset: -1px;
  }
</style>
